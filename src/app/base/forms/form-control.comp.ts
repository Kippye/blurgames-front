import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'app-form-control',
  imports: [],
  template: ` <div class="mb-3">
    @if (label()) {
      <label [htmlFor]="inputId()" class="form-label">
        {{ label() }}
        @if (required()) {
          <span class="text-primary">*</span>
        }
      </label>
    }
    <ng-content select="input, textarea, select, app-search-select-dropdown" />
  </div>`,
  styles: ``,
})
export class BaseFormControlComponent {
  inputId = input<string>();
  label = input<string>();
  required = input(false, { transform: booleanAttribute });
}
