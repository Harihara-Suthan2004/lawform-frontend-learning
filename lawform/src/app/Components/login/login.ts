import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  isModalOpen = signal(false);
  isLoginView = signal(true);
  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  openModal() {
    this.isModalOpen.set(true);
    this.isLoginView.set(true);
    this.email.set('');
    this.password.set('');
    this.errorMessage.set('');
    this.isLoading.set(false);
  }
  
  closeModal() {
    this.isModalOpen.set(false);
  }

  toggleView() {
    this.isLoginView.update(value => !value);
    this.errorMessage.set('');
  }
  
  handleLogin() {
    // Clear previous error
    this.errorMessage.set('');
    
    // Validate
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Email and password are required');
      return;
    }

    // Show loading
    this.isLoading.set(true);

    this.authService.login({
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: (response: any) => {
        console.log('Login success', response);
        this.isLoading.set(false);
        this.closeModal();
        
        // Redirect based on role
        const userRole = this.authService.getUserRole();
        if (userRole === 'admin') {
          this.router.navigate(['/app/users']); // Redirect admin to users page
        } else {
          this.router.navigate(['/app/home']); // Redirect regular user to home
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log('Login error:', error);
        this.isLoading.set(false);
        
        if (error.error && error.error.detail) {
          this.errorMessage.set(error.error.detail);
        } else {
          this.errorMessage.set('Invalid credentials');
        }
      }
    });
  }
}