import { CommonModule } from '@angular/common';
import { Component,signal } from '@angular/core';
import { Header } from '../../Components/header/header';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-notice-preview',
  imports: [CommonModule, Header, RouterLink],
  templateUrl: './notice-preview.html',
  styleUrl: './notice-preview.css',
})
export class NoticePreview {
 showMenu = signal(false);

  toggleMenu(){
    this.showMenu.update(val=>!val)
  }
}
