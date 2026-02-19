import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
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
