import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const target = authService.isAdmin() ? '/app/users' : '/app/home';
    router.navigate([target]);
    return false; 
  }
  return true;
};

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/']);
    return false;
  }

  const userRole = authService.getUserRole();
  const url = state.url;
  
  // Admin-only restrictions
  if (userRole === 'admin' && (url.includes('/home') || url.includes('/history'))) {
    router.navigate(['/app/users']);
    return false;
  }
  
  // User-only restrictions
  if (userRole === 'user' && url.includes('/users')) {
    router.navigate(['/app/home']);
    return false;
  }

  return true;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }
  router.navigate(['/app/home']);
  return false;
};