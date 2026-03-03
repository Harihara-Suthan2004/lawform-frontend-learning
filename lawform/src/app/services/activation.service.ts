import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ActivateAccountRequest {
  token: string;
  password: string;
  confirm_password: string;
}

export interface ActivateAccountResponse {
  success: boolean;
  message: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivationService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  activateAccount(data: ActivateAccountRequest): Observable<ActivateAccountResponse> {
    console.log('Sending activation request:', data);
    return this.http.post<ActivateAccountResponse>(`${this.apiUrl}/activate-account`, data);
  }
}