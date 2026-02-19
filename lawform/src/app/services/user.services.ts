import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    const token = localStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: Bearer ${token}
    });

    return this.http.get(${this.apiUrl}/users, { headers });
  }
}
