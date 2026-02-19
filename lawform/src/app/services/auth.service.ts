import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, UserData, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(${this.apiUrl}/login, credentials).pipe(
      tap((response: LoginResponse) => {
        console.log('Login response:', response);
        if (response.data?.access_token) {
          this.setToken(response.data.access_token);
          this.setUserData({
            email: credentials.email,
            role: response.data.role
          });
        }
      })
    );
  }

  // Register method for adding users
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(${this.apiUrl}/register, userData);
  }

  logout(): void {
    this.removeToken();
    this.removeUserData();
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getUserData(): UserData | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  private setUserData(userData: UserData): void {
    localStorage.setItem(this.userKey, JSON.stringify(userData));
  }

  private removeUserData(): void {
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const userData = this.getUserData();
    return userData ? userData.role : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isUser(): boolean {
    return this.getUserRole() === 'user';
  }
}