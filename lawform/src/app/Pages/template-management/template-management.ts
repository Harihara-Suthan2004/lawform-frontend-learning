import { Component } from '@angular/core';
import { Header } from '../../Components/header/header';

@Component({
  selector: 'app-template-management',
  imports: [Header],
  templateUrl: './template-management.html',
  styleUrl: './template-management.css',
})
export class TemplateManagement {

  // modal state
  showCreateModal = false;

  // open popup
  openModal() {
    this.showCreateModal = true;
  }

  // close popup
  closeModal() {
    this.showCreateModal = false;
  }
}
