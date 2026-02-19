import { Component, Input, signal,inject } from '@angular/core';
import { Profile } from '../profile/profile';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [Profile,RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() title:string='Home'
   private authService = inject(AuthService);
   
   logout(): void {
    this.authService.logout();
  }
}

