import { CommonModule } from '@angular/common';
import { Component, signal, inject, OnInit } from '@angular/core';
import { Header } from '../../Components/header/header';
import { RouterLink, ActivatedRoute } from "@angular/router";
import { NoticeService } from '../../services/notice.service';

@Component({
  selector: 'app-downloaded-notice',
  standalone: true, // 1. Marking this component as standalone
  imports: [CommonModule, Header, RouterLink],
  templateUrl: './downloaded-notice.html',
  styleUrl: './downloaded-notice.css',
})
export class DownloadedNotice implements OnInit {
  // 1. Declare the missing Signals
  showMenu = signal(false);
  noticeText = signal<string>('Loading notice content...');
  clientName = signal<string>('');

  isNewVersionDraft = signal<boolean>(false);
  
  // title handling signals
  noticeTitle = signal<string>('');
  hasOfficialTitle = signal<boolean>(false);
  
  isRegenerating = signal<boolean>(false);
  currentDocId: number | null = null;

  private route = inject(ActivatedRoute);
  private noticeService = inject(NoticeService);

  ngOnInit() {
    const docId = this.route.snapshot.params['id'];
    if (docId) {
      this.currentDocId = Number(docId);
      this.fetchText(this.currentDocId);
    }
  }

  // Helper method to handle the logic for both initial load and regeneration
  private processIncomingText(text: string) {
    const titleKey = "OFFICIAL LEGAL NOTICE";
    let cleanText = text;

    // Check for title existence regardless of case
    if (cleanText.toUpperCase().includes(titleKey)) {
        this.hasOfficialTitle.set(true);
        this.noticeTitle.set(titleKey);
        
        // Remove the title from the text for cleaner display
        const regex = new RegExp(titleKey, 'gi');
        cleanText = cleanText.replace(regex, '').trim();
    } else {
        this.hasOfficialTitle.set(false);
    }
    
    this.noticeText.set(cleanText);
}

  fetchText(id: number) {
    this.noticeService.getNoticeText(id).subscribe({
      next: (res) => {
        this.clientName.set(res.client_name);
        this.processIncomingText(res.text);
      },
      error: () => this.noticeText.set("Failed to load content.")
    });
  }

  regenerate() {
    if (!this.currentDocId || this.isRegenerating()) return;
    this.isRegenerating.set(true);
    this.noticeService.regenerateFromHistory(this.currentDocId).subscribe({
      next: (res) => this.pollStatus(res.request_id),
      error: () => {
        this.isRegenerating.set(false);
        alert("Failed to start regeneration.");
      }
    });
  }

  private pollStatus(requestId: string) {
  const interval = setInterval(() => {
    this.noticeService.getStatus(requestId).subscribe({
      next: (statusRes) => {
        if (statusRes.status === 'success') {
          clearInterval(interval);
          this.isRegenerating.set(false);

          const newText = statusRes.result; 
          if (newText) {
            this.processIncomingText(newText);
            // Since this is a fresh regeneration, we treat it as a new draft version that hasn't been saved to the cloud yet.
            this.isNewVersionDraft.set(true); 
          }
        } else if (statusRes.status === 'failed') {
          clearInterval(interval);
          this.isRegenerating.set(false);
          alert("Regeneration failed.");
        }
      },
      error: () => {
        clearInterval(interval);
        this.isRegenerating.set(false);
      }
    });
  }, 2000);
}

  downloadAgain() {
  if (!this.currentDocId) return;

  // SCENARIO A: It is a new draft version that has not been saved to the cloud yet
  if (this.isNewVersionDraft()) {
    const currentTitle = this.hasOfficialTitle() ? this.noticeTitle() : "OFFICIAL LEGAL NOTICE";
    
    this.noticeService.saveAndDownloadVersion(this.currentDocId, this.noticeText(), currentTitle)
      .subscribe({
        next: (response) => {
          // 1. Handle the file download
          const blob = response.body;
          if (blob) {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Notice_Version.pdf`; 
            a.click();
            window.URL.revokeObjectURL(url);
          }

          // 2. Update the currentDocId with the new version's doc ID returned from the server (if provided)
          const newDocId = response.headers.get('X-New-Doc-Id');
          if (newDocId) {
            this.currentDocId = Number(newDocId);
            this.isNewVersionDraft.set(false); // Now it's no longer a draft since it's saved in the cloud with a new doc ID
          }
        },
        error: () => alert("Error saving new version to cloud.")
      });
  } 
  // SCENARIO B: It's not a new draft, so we just download the existing version from history
  else {
    this.noticeService.downloadFromHistory(this.currentDocId).subscribe({
      next: (res) => { if (res.url) window.open(res.url, '_blank'); },
      error: () => alert("Error retrieving download link.")
    });
  }
}

  toggleMenu() {
    this.showMenu.update(val => !val);
  }
}