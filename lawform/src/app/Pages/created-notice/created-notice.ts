import { CommonModule } from '@angular/common';
import { Component,signal } from '@angular/core';
import { Header } from '../../Components/header/header';
import { RouterLink } from "@angular/router";
import { CreateNotice } from '../create-notice/create-notice';
import { Home } from '../home/home';

@Component({
  selector: 'app-created-notice',
  imports: [CommonModule, Header, RouterLink,CreateNotice,Home],
  templateUrl: './created-notice.html',
  styleUrl: './created-notice.css',
})
export class CreatedNotice {
 showMenu = signal(false);

  toggleMenu(){
    this.showMenu.update(val=>!val)
  }
}
