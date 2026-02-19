import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css'
})
export class AddUser {

  private authService = inject(AuthService);

  @Output() close = new EventEmitter<void>();
  @Output() userAdded = new EventEmitter<any>();

  isSaving = false;
  errorMessage = '';

  newUser = {
    username: '',
    email: '',
    password: '',
    role: ''
  };

  closeModal() {
    this.close.emit();
    this.resetForm();
  }

  resetForm() {
    this.newUser = {
      username: '',
      email: '',
      password: '',
      role: ''
    };
    this.errorMessage = '';
    this.isSaving = false;
  }

  validatePassword(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/\d/.test(password)) {
      return { valid: false, message: 'Password must contain at least one digit' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }
    return { valid: true, message: '' };
  }

  saveUser() {

    if (!this.newUser.username || !this.newUser.email || !this.newUser.password || !this.newUser.role) {
      this.errorMessage = 'All fields are required';
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.newUser.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    const passwordValidation = this.validatePassword(this.newUser.password);
    if (!passwordValidation.valid) {
      this.errorMessage = passwordValidation.message;
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    this.authService.register(this.newUser).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.userAdded.emit(response);
        this.closeModal();
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving = false;

        if (error.error?.detail) {
          this.errorMessage = error.error.detail;
        } else {
          this.errorMessage = 'Failed to create user';
        }
      }
    });
  }
}