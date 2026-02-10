import { CommonModule } from '@angular/common';
import { Component,signal } from '@angular/core';
import { Header } from '../../Components/header/header';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-downloaded-notice',
  imports: [CommonModule, Header, RouterLink],
  templateUrl: './downloaded-notice.html',
  styleUrl: './downloaded-notice.css',
})
export class DownloadedNotice {

 showMenu = signal(false);

   toggleMenu(){
    this.showMenu.update(val=>!val)
  }
}
