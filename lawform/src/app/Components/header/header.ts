import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() title:string='Home'

  isModalOpen = signal(false); //popup
   isLoginView = signal(true); // forgetpass

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
}
