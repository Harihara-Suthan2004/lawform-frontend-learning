import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-create-template-modal',
  standalone: true,
  templateUrl: './create-template-modal.html',
  styleUrl: './create-template-modal.css',
})
export class CreateTemplateModal {

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
