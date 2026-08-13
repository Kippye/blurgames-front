import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-modal-footer',
  imports: [],
  template: `
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="modalCancel.emit()">Cancel</button>
      <button type="button" class="btn btn-danger" (click)="delete.emit()" [disabled]="isLoading()">
        @if (isLoading()) {
          <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          Deleting...
        } @else {
          Delete
        }
      </button>
    </div>
  `,
  styles: ``,
})
export class BaseDeleteModalFooter {
  isLoading = input<boolean>(false);
  modalCancel = output();
  delete = output();
}
