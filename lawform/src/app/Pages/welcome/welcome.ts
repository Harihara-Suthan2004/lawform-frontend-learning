import { Component,signal,inject } from '@angular/core';
import { RouterLink,Router } from "@angular/router";

@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  private router = inject(Router);
   isModalOpen = signal(false);
   isLoginView = signal(true);
  openModal(){
    this.isModalOpen.set(true);
    this.isLoginView.set(true);
   }
   closeModal(){
    this.isModalOpen.set(false);
   }

   toggleView(){
    this.isLoginView.update(value => !value);
   }
   handleLogin(){
    this.closeModal();
    this.router.navigate(['/app/home']);
   }

}
