import { Injectable,NgZone,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap,throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, UserData, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  private http = inject(HttpClient);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  constructor() {
    this.initStorageListener();
    this.initPopStateListener();
  }

  private initPopStateListener() {
    window.addEventListener('popstate', () => {
      if (window.location.pathname === '/' && this.isLoggedIn()) {
        this.logout(); 
      }
    });
  }

  // Keeps tabs in sync
  private initStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === this.tokenKey) {
        this.ngZone.run(() => window.location.reload());
      }
    });
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('Login response:', response);
        if (response.data?.access_token) {
          sessionStorage.setItem(this.tokenKey, response.data.access_token);
          sessionStorage.setItem(this.userKey, JSON.stringify({
            email: credentials.email,
            role: response.data.role
          }));
        }
      })
    );
  }

  // Register method for adding users
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.tokenKey); 
  }

  getUserRole(): string | null {
    const userData = sessionStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData).role : null;
  } 

  isUser(): boolean {
    return this.getUserRole() === 'user';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
    this.router.navigate(['/']);
  }
}