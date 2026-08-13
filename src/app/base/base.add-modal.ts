import { Component, input } from '@angular/core';

@Component({
  selector: 'app-base-add-modal',
  imports: [],
  template: ` <p>base.add-modal works!</p> `,
  styles: ``,
})
export class BaseAddModal {
  isOpen = input<boolean>();
  entityTypeName = input.required<string>();
}
