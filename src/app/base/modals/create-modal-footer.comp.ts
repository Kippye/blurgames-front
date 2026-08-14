import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-create-modal-footer',
  imports: [],
  template: `
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="modalCancel.emit()">Cancel</button>
      <button
        type="button"
        class="btn btn-primary"
        (click)="create.emit()"
        [disabled]="isLoading()"
      >
        @if (isLoading()) {
          <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          Creating...
        } @else {
          Create
        }
      </button>
    </div>
  `,
  styles: ``,
})
export class CreateModalFooter {
  isLoading = input<boolean>(false);
  modalCancel = output();
  create = output();
}
