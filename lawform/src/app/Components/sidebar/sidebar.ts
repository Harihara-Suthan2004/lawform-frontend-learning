import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private router = inject(Router);
  private authService = inject(AuthService);

  isHomeActive(): boolean {
    const url = this.router.url;
    return url === '/app/home' || url === '/app/create-notice' || url === '/app/generated';
  }

  isHistoryActive(): boolean {
    const url = this.router.url;
    return url === '/app/history' || url === '/app/downloaded';
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isUser(): boolean {
    return this.authService.isUser();
  }

  logout(): void {
    this.authService.logout();
  }
}