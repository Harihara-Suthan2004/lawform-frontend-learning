import { Component } from '@angular/core';
import { Header } from '../../Components/header/header';
import { CreateTemplateModal } from '../../Components/create-template-modal/create-template-modal';

@Component({
 selector: 'app-template-modal',
  standalone: true,
  imports: [Header, CreateTemplateModal],
  templateUrl: './template-management.html',
  styleUrl: './template-management.css',
})
export class TemplateManagement {

  showCreateModal = false;

  openModal() {
    this.showCreateModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
  }
}
