import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-add-modal-header',
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
export class BaseAddModalHeader {
  action = input.required<'Add new' | 'Edit' | 'Delete'>();
  entityName = input.required<string>();
  modalClose = output();
}
