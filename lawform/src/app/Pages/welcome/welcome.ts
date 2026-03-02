import { Component, OnInit, inject } from '@angular/core';
import { Login } from '../../Components/login/login';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivationModal } from '../../Components/activation-modal/activation-modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [Login, ActivationModal, CommonModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  showActivationModal = false;
  activationToken: string = '';
  activationEmail: string = '';

  ngOnInit() {
    console.log('Welcome component initialized');
    
    // Check for token in URL query params immediately
    this.route.queryParams.subscribe(params => {
      console.log('Query params received:', params);
      
      const token = params['token'];
      const email = params['email'];
      
      if (token && email) {
        console.log('Activation token found:', token);
        console.log('Activation email found:', email);
        
        this.activationToken = token;
        this.activationEmail = email;
        
        // Show activation modal immediately (remove timeout or keep minimal delay)
        this.showActivationModal = true;
        console.log('showActivationModal set to:', this.showActivationModal);
      } else {
        console.log('No activation token in URL');
      }
    });
  }

  ngAfterViewInit() {
    // Additional check after view initialization
    console.log('Welcome component view initialized');
    console.log('Modal state:', this.showActivationModal);
  }

  closeActivationModal() {
    console.log('Closing activation modal');
    this.showActivationModal = false;
    
    // Remove query params from URL
    this.router.navigate([], {
      queryParams: { token: null, email: null },
      queryParamsHandling: 'merge'
    });
  }

  onAccountActivated() {
    console.log('Account activated successfully');   
  }
}