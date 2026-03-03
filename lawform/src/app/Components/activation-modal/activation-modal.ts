import { Component, signal, inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivationService } from '../../services/activation.service';

@Component({
  selector: 'app-activation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activation-modal.html',
  styleUrls: ['./activation-modal.css']
})
export class ActivationModal implements OnInit {
  @Input() token: string = '';
  @Input() email: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() activated = new EventEmitter<void>();

  private activationService = inject(ActivationService);
  private router = inject(Router);

  
  passwordValue: string = '';
  confirmPasswordValue: string = '';
  
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  ngOnInit() {
    console.log('Activation Modal initialized with:', {
      token: this.token,
      email: this.email
    });
    
    // Reset form values when modal opens
    this.passwordValue = '';
    this.confirmPasswordValue = '';
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isLoading.set(false);
  }

 

  closeModal() {
    console.log('Closing modal');
    this.close.emit();
  }

  handleActivation() {
    console.log('Attempting activation with:', {
      token: this.token,
      email: this.email,
      passwordLength: this.passwordValue.length
    });

    // Validate
    if (!this.passwordValue || !this.confirmPasswordValue) {
      this.errorMessage.set('Please enter both password fields');
      return;
    }

    if (this.passwordValue !== this.confirmPasswordValue) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    if (this.passwordValue.length < 8) {
      this.errorMessage.set('Password must be at least 8 characters');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.activationService.activateAccount({
      token: this.token,
      password: this.passwordValue,
      confirm_password: this.confirmPasswordValue
    }).subscribe({
      next: (response) => {
        console.log('Activation response:', response);
        this.isLoading.set(false);
        this.successMessage.set(response.message || 'Account activated successfully!');
        this.errorMessage.set('');
        
        // Emit activated event
        this.activated.emit();
        
        // Auto redirect after 3 seconds
        setTimeout(() => {
          this.redirectToHome();
        }, 3000);
      },
      error: (error) => {
        console.error('Activation error:', error);
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.detail || 'Activation failed. Please try again.');
        
        // Clear password fields on error
        this.passwordValue = '';
        this.confirmPasswordValue = '';
      }
    });
  }

  redirectToHome() {
    console.log('Redirecting to home');
    this.close.emit();
    this.router.navigate(['/app/home']);
  }
}