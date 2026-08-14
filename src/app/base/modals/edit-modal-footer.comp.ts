import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-edit-modal-footer',
  imports: [],
  template: `
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="modalCancel.emit()">Cancel</button>
      <button
        type="button"
        class="btn btn-primary"
        (click)="save.emit()"
        [disabled]="isPristine() || isLoading()"
      >
        @if (isLoading()) {
          <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          Saving...
        } @else {
          Save
        }
      </button>
    </div>
  `,
  styles: ``,
})
export class EditModalFooter {
  isLoading = input<boolean>(false);
  isPristine = input<boolean>(false);
  modalCancel = output();
  save = output();
}
