import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal-header',
  imports: [],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ action() }} {{ entityName() }}</h5>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="modalClose.emit()"
      ></button>
    </div>
  `,
  styles: ``,
})
export class ModalHeader {
  action = input.required<'Create' | 'Edit' | 'Delete'>();
  entityName = input.required<string>();
  modalClose = output();
}
