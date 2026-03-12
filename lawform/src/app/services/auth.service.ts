import { Injectable, NgZone, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap} from 'rxjs';
import { Router } from '@angular/router';

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

  //Detects physical browser 'Back' button
  private initPopStateListener() {
    window.addEventListener('popstate', () => {
      if (window.location.pathname === '/' && this.isLoggedIn()) {
        const target =this.isAdmin() ? '/app/users' : '/app/home';
        this.router.navigate([target]);
      }
    });
  }

 private initStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === this.tokenKey) {
        this.ngZone.run(() => {
          if (!event.newValue) {
            this.router.navigate(['/']);
          } else {
            window.location.reload();
          }
        });
      }
    });
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.data?.access_token) {
          localStorage.setItem(this.tokenKey, response.data.access_token);
          localStorage.setItem(this.userKey, JSON.stringify({
            email: credentials.email,
            role: response.data.role
          }));
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData).role : null;
  }

  isUser(): boolean {
    return this.getUserRole() === 'user';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/']);
  }
}