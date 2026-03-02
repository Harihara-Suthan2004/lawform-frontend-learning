import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css'
})
export class AddUser {

  private authService = inject(AuthService);
  constructor(private toastr: ToastrService) {}

  @Output() close = new EventEmitter<void>();
  @Output() userAdded = new EventEmitter<any>();

  isSaving = false;
  errorMessage = '';
  
  // Field-specific error messages
  emailError = '';
  passwordError = '';
  usernameError = '';
  roleError = '';

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
    this.emailError = '';
    this.passwordError = '';
    this.usernameError = '';
    this.roleError = '';
    this.isSaving = false;
  }

  validateEmail(email: string): { valid: boolean; message: string } {
    // Check if email is provided
    if (!email) {
      return { valid: false, message: 'Email is required' };
    }

    // Check email format using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Invalid email format. Please enter a valid email address (e.g., name@example.com)' };
    }

    // Check for lowercase
    if (email !== email.toLowerCase()) {
      return { valid: false, message: 'Email must be in lowercase' };
    }

    // Check for minimum length
    if (email.length < 5) {
      return { valid: false, message: 'Email is too short' };
    }

    // Check for maximum length
    if (email.length > 254) {
      return { valid: false, message: 'Email is too long (maximum 254 characters)' };
    }

    // Check for common disposable email domains (optional)
    const disposableDomains = ['tempmail.com', 'throwaway.com', 'mailinator.com', 'yopmail.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && disposableDomains.includes(domain)) {
      return { valid: false, message: 'Disposable email addresses are not allowed' };
    }

    return { valid: true, message: '' };
  }

  validatePassword(password: string): { valid: boolean; message: string } {
    if (!password) {
      return { valid: false, message: 'Password is required' };
    }
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

  validateUsername(username: string): { valid: boolean; message: string } {
    if (!username) {
      return { valid: false, message: 'Username is required' };
    }
    if (username.length < 3) {
      return { valid: false, message: 'Username must be at least 3 characters long' };
    }
    if (username.length > 50) {
      return { valid: false, message: 'Username must be less than 50 characters' };
    }
    // Only allow letters, numbers, and underscores
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    return { valid: true, message: '' };
  }

  validateRole(role: string): { valid: boolean; message: string } {
    if (!role) {
      return { valid: false, message: 'Role is required' };
    }
    if (role !== 'user' && role !== 'admin') {
      return { valid: false, message: 'Role must be either User or Admin' };
    }
    return { valid: true, message: '' };
  }

  onEmailChange() {
    // Clear previous email error when user starts typing
    this.emailError = '';
    this.errorMessage = '';
    
    // Real-time validation (optional - uncomment if you want real-time feedback)
    // if (this.newUser.email) {
    //   const validation = this.validateEmail(this.newUser.email);
    //   this.emailError = validation.valid ? '' : validation.message;
    // }
  }

  onPasswordChange() {
    this.passwordError = '';
    this.errorMessage = '';
  }

  onUsernameChange() {
    this.usernameError = '';
    this.errorMessage = '';
  }

  onRoleChange() {
    this.roleError = '';
    this.errorMessage = '';
  }

  saveUser() {
    // Reset all errors
    this.emailError = '';
    this.passwordError = '';
    this.usernameError = '';
    this.roleError = '';
    this.errorMessage = '';

    // Validate all fields
    const usernameValidation = this.validateUsername(this.newUser.username);
    if (!usernameValidation.valid) {
      this.usernameError = usernameValidation.message;
      return;
    }

    const emailValidation = this.validateEmail(this.newUser.email);
    if (!emailValidation.valid) {
      this.emailError = emailValidation.message;
      return;
    }

    const passwordValidation = this.validatePassword(this.newUser.password);
    if (!passwordValidation.valid) {
      this.passwordError = passwordValidation.message;
      return;
    }

    const roleValidation = this.validateRole(this.newUser.role);
    if (!roleValidation.valid) {
      this.roleError = roleValidation.message;
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    this.authService.register(this.newUser).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'User created successfully!', 'Success');
        this.isSaving = false;
        this.userAdded.emit(response);
        this.closeModal();
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving = false;

        // Handle specific error messages from backend
        if (error.error?.detail) {
          const errorDetail = error.error.detail;
          
          // Check if it's an email-related error
          if (errorDetail.includes('Email') || errorDetail.includes('email')) {
            if (errorDetail.includes('already registered')) {
              this.emailError = 'This email is already registered. Please use a different email.';
            } else if (errorDetail.includes('lowercase')) {
              this.emailError = 'Email must be in lowercase.';
            } else if (errorDetail.includes('format')) {
              this.emailError = 'Invalid email format. Please enter a valid email address.';
            } else {
              this.emailError = errorDetail;
            }
          } 
          // Check if it's a password-related error
          else if (errorDetail.includes('Password') || errorDetail.includes('password')) {
            this.passwordError = errorDetail;
          }
          // Other errors
          else {
            this.errorMessage = errorDetail;
          }
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Failed to create user. Please try again.';
        }

        // Log error for debugging
        console.error('Registration error:', error);
      }
    });
  }
}