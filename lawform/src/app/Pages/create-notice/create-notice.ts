import { Component, inject } from '@angular/core';
import { Header } from '../../Components/header/header';
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms'; // <--- Vital for capturing input
import { NoticeService, NoticeRequest } from '../../services/notice.service';

@Component({
  selector: 'app-create-notice',
  imports: [Header, RouterLink, FormsModule], 
  templateUrl: './create-notice.html',
  styleUrl: './create-notice.css',
})
export class CreateNotice {
  private noticeService = inject(NoticeService);
  private router = inject(Router);

  // Data object to store user inputs
  formData: NoticeRequest = {
    sender_name: '',
    sender_email: '',
    sender_contact:  '',
    sender_address: '',
    recipient_name: '',
    recipient_email: '',
    recipient_contact: '',
    recipient_address: '',
    penal_code: '',
    notice_type: '',
    description: ''
  };

  senderLastName = '';
  recipientLastName = '';

  generate() {
    console.log("Generating notice...", this.formData);
    
    this.noticeService.generateNotice(this.formData).subscribe({
  next: (response: any) => { 
    this.router.navigate(['/app/generated'], { 
      queryParams: { id: response.request_id } 
    });
  },
  error: (err: any) => { 
    console.error('Error:', err);
  }
});
  }
}