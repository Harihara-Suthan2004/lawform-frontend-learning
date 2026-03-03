import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
     provideAnimations(),
     provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: false
    }),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};