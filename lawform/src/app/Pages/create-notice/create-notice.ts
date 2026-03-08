import { Component, inject } from '@angular/core';
import { Header } from '../../Components/header/header';
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms'; 
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
    sender_firstname: '',
    sender_lastname: '',
    sender_email: '',
    sender_contact:  '',
    sender_address: '',
    sender_zip: '',
    sender_city: '',
    sender_state: '',
    recipient_firstname: '',
    recipient_lastname: '',
    recipient_email: '',
    recipient_contact: '',
    recipient_address: '',
    recipient_zip: '',
    recipient_city: '',
    recipient_state: '',
    penal_code: '',
    notice_type: '',
    description: ''
  };

  senderLastName = '';
  recipientLastName = '';
  isSubmitted =false;

  generate() {
    this.isSubmitted = true;
    if (!this.formData.sender_firstname || !this.formData.recipient_firstname || !this.formData.penal_code || !this.formData.notice_type) {
      alert('Please fill in all required fields.');
      return;
    }
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