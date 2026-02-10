import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(public router: Router) {}
  isHomeActive(): boolean {
    const url = this.router.url;
   
    return url === '/app/home' || url === '/app/create-notice' || url === '/app/generated';
  }

   isHistoryActive(): boolean {
    const url = this.router.url;
   
    return url === '/app/history' || url === '/app/downloaded';
  }
}
