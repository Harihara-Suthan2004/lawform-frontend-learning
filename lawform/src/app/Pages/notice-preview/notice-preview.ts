import { CommonModule } from '@angular/common';
import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { Header } from '../../Components/header/header';
import { RouterLink, ActivatedRoute } from "@angular/router";
import { NoticeService } from '../../services/notice.service';
import { interval, Subscription, switchMap, takeWhile } from 'rxjs';

@Component({
  selector: 'app-created-notice',
  imports: [CommonModule, Header, RouterLink],
  templateUrl: './notice-preview.html',
  styleUrl: './notice-preview.css',   
})
export class NoticePreview implements OnInit, OnDestroy {
  showMenu = signal(false);
  
  // Data Signals
  noticeContent = signal<string>("Generating your notice...");
  isLoading = signal<boolean>(true);
  
  private route = inject(ActivatedRoute);
  private noticeService = inject(NoticeService);
  private pollSub: Subscription | null = null;
  requestId: string | null = null;

  ngOnInit() {
    // 1. Get the ID passed from the previous page
    this.route.queryParams.subscribe(params => {
      this.requestId = params['id'];
      if (this.requestId) {
        this.startPolling(this.requestId);
      }
    });
  }

  startPolling(id: string) {
    this.isLoading.set(true);
    
    // 2. Check status every 2 seconds
    this.pollSub = interval(2000)
      .pipe(
        switchMap(() => this.noticeService.getStatus(id)),
        // Stop polling when completed or failed
        takeWhile(res => res.status !== 'success' && res.status !== 'failed', true)
      )
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.noticeContent.set(res.result);
            this.isLoading.set(false);
          } else if (res.status === 'failed') {
            this.noticeContent.set("Failed: " + res.result);
            this.isLoading.set(false);
          }
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
    this.showMenu.update(val=>!val)
  }

  ngOnDestroy() {
    if (this.pollSub) this.pollSub.unsubscribe();
  }
}