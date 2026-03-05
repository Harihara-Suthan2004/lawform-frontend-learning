import { Injectable, inject } from '@angular/core'; 
import { HttpHeaders,HttpClient } from '@angular/common/http';
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

 downloadNoticePdf(content: string, formData: any) {
  const token = localStorage.getItem('auth_token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // Used by backend to create client
  const payload = { 
    text: content,
    first_name: formData.recipient_name, 
    last_name: 'Client', 
    email: formData.recipient_email,
    mobile_number: formData.recipient_contact,
    address: formData.recipient_address,
    zip_code: '625001', // Default for now
    city: 'Madurai',
    state: 'Tamil Nadu'
  };

  return this.http.post('http://localhost:8000/api/download-pdf', 
    payload, 
    { headers, responseType: 'blob' }
  );
}
}