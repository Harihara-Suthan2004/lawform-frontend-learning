import { CommonModule } from '@angular/common';
import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { Header } from '../../Components/header/header';
import { RouterLink, ActivatedRoute } from "@angular/router";
import { NoticeService, NoticeRequest } from '../../services/notice.service'; // Added NoticeRequest
import { interval, Subscription, switchMap, takeWhile } from 'rxjs';

@Component({
  selector: 'app-created-notice',
  standalone: true, // Assuming standalone based on your imports
  imports: [CommonModule, Header, RouterLink],
  templateUrl: './notice-preview.html',
  styleUrl: './notice-preview.css',  
})
export class NoticePreview implements OnInit, OnDestroy {
  showMenu = signal(false);
  
  // Data Signals
  noticeContent = signal<string>("Generating your notice...");
  noticeTitle = signal<string>("Legal Notice");
  isLoading = signal<boolean>(true);
  
  // NEW: Store the full input data received from the status check
  originalNoticeData = signal<NoticeRequest | null>(null);

  private route = inject(ActivatedRoute);
  private noticeService = inject(NoticeService);
  private pollSub: Subscription | null = null;
  requestId: string | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.requestId = params['id'];
      if (this.requestId) {
        this.startPolling(this.requestId);
      }
    });
  }

  startPolling(id: string) {
    this.isLoading.set(true);
    this.pollSub = interval(2000)
      .pipe(
        switchMap(() => this.noticeService.getStatus(id)),
        takeWhile(res => res.status !== 'success' && res.status !== 'failed', true)
      ).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.noticeContent.set(res.result);
            this.noticeTitle.set(res.notice_title || "Legal Notice");
            
            // If your backend returns the original input in the result, store it
            // This is crucial for the 'downloadNoticePdf' call later
            if (res.original_input) {
              this.originalNoticeData.set(res.original_input);
            }
            
            this.isLoading.set(false);
          } else if (res.status === 'failed') {
            this.noticeContent.set("Failed: " + res.result);
            this.isLoading.set(false);
          }
        }
      });
  }

  downloadPdf() {
    const content = this.noticeContent();
    const title = this.noticeTitle();
    const formData = this.originalNoticeData();

    // Guard clause
    if (this.isLoading() || content.startsWith("Generating")) return;

    // ERROR FIX: Check if we have the formData needed for the Client Upsert
    if (!formData) {
      alert("Notice data not found. Please try regenerating or go back to the form.");
      return;
    }

    // Now calling the updated service method with the required NoticeRequest object
    this.noticeService.downloadNoticePdf(content, formData, title).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const fileName = this.requestId ? `Notice_${this.requestId}.pdf` : 'Notice_preview.pdf';
        link.download = fileName;

        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed:', err);
        alert("Download failed. The session may have expired.");
      }
    });
  }

  regenerate() {
    if (this.requestId) {
       this.noticeContent.set("Regenerating...");
       this.noticeService.regenerate(this.requestId).subscribe(() => {
         this.startPolling(this.requestId!);
       });
    }
  }

  toggleMenu(){
    this.showMenu.update(val => !val);
  }

  ngOnDestroy() {
    if (this.pollSub) this.pollSub.unsubscribe();
  }
}