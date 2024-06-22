import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="text-black modal-overlay" *ngIf="isVisible" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
      <div class="modal-header">
          <h1 class="modal-title">{{text}}</h1>
          <button class="close-button" (click)="close()">&times;</button>
        </div>
        <div class="modal-body text-black">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background: white;
      padding: 10px;
      border-radius: 8px;
      max-width: 500px;
      width: 100%;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: end;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 10px;
    }
    .modal-body {
      margin: 20px 0;
    }    
    .modal-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: bold;
    }
    .close-button {
      background: none;
      color: red;
      border: none;
      font-size: 2rem;
      padding-bottom: 4px;
      cursor: pointer;
    }
  `]
})
export class ModalComponent {
  @Input() text: string = '';
  @Input() isVisible: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
