import { Injectable, inject } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NoticeRequest {
  sender_name: string;
  sender_email: string;
  sender_contact: string;
  sender_address: string;
  recipient_name: string;
  recipient_email: string;
  recipient_contact: string;
  recipient_address: string;
  penal_code: string;
  notice_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api'; // Matches your FastAPI URL

  // Send data to backend to start generation
  generateNotice(data: NoticeRequest): Observable<{ request_id: string, status: string }> {
    return this.http.post<{ request_id: string, status: string }>(`${this.apiUrl}/generate-notice`, data);
  }

  //  Poll backend to check if text is ready
  getStatus(requestId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/notice-status/${requestId}`);
  }

  //  Retry if needed
  regenerate(requestId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/regenerate-notice`, { request_id: requestId });
  }
}