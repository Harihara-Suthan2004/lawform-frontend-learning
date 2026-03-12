import { Injectable, inject } from '@angular/core'; 
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface NoticeRequest {
  sender_firstname: string;
  sender_lastname: string;
  sender_email: string;
  sender_contact: string;
  sender_address: string;
  sender_address2: string;
  sender_zip: string;
  sender_city: string;
  sender_state: string;
  recipient_firstname: string;
  recipient_lastname: string;
  recipient_email: string;
  recipient_contact: string;
  recipient_address: string;
  recipient_address2: string;
  recipient_zip: string;
  recipient_city: string;
  recipient_state: string;
  penal_code: string;
  notice_type: string;
  description: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api'; 

  generateNotice(data: NoticeRequest): Observable<{ request_id: string, status: string }> {
    return this.http.post<{ request_id: string, status: string }>(`${this.apiUrl}/generate-notice`, data);
  }

  getStatus(requestId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/notice-status/${requestId}`);
  }

  regenerate(requestId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/regenerate-notice`, { request_id: requestId });
  }

  getHistory(): Observable<any[]> {
  const token = localStorage.getItem('auth_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(`${this.apiUrl}/history`, { headers });
}

downloadFromHistory(docId: number): Observable<{ url: string }> {
  const token = localStorage.getItem('auth_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<{ url: string }>(`${this.apiUrl}/download-file/${docId}`, {
    headers
  });
}

getNoticeText(docId: number): Observable<{ text: string, client_name: string }> {
  const token = localStorage.getItem('auth_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<{ text: string, client_name: string }>(`${this.apiUrl}/view-text/${docId}`, { headers });
}

regenerateFromHistory(docId: number): Observable<{ request_id: string, status: string }> {
  const token = localStorage.getItem('auth_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<{ request_id: string, status: string }>(
    `${this.apiUrl}/regenerate-history-document/${docId}`, 
    {}, 
    { headers }
  );
}

saveAndDownloadVersion(parentDocId: number, content: string, title: string) {
  const token = localStorage.getItem('auth_token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  
  const payload = { 
    text: content, 
    notice_title: title 
  };

  return this.http.post(`${this.apiUrl}/save-version/${parentDocId}`, payload, {
    headers,
    observe: 'response', // We need the full response to access headers for the new doc ID
    responseType: 'blob' // Expecting a PDF file back
  });
}

 downloadNoticePdf(content: string, formData: NoticeRequest, noticeTitle: string) {
  const token = localStorage.getItem('auth_token'); 
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const payload = { 
    text: content,
    notice_title: noticeTitle,
    sender_details: {
      first_name: formData.sender_firstname,
      last_name: formData.sender_lastname,
      email: formData.sender_email,
      mobile_number: formData.sender_contact,
      zip_code: formData.sender_zip,
      city: formData.sender_city,
      state: formData.sender_state
    }
  };

  return this.http.post('http://localhost:8000/api/download-pdf', 
    payload, 
    { headers, responseType: 'blob' }
  );
}
}