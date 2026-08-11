import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-errors',
  template: `
    @if (shouldShow) {
      <div class="invalid-feedback d-block mb-2 mt-0">
        @for (message of messages; track message) {
          <div>{{ message }}</div>
        }
      </div>
    }
  `,
})
export class ValidationErrorsComponent {
  control = input.required<AbstractControl>();
  submitted = input(false);

  private static readonly errorMessages = {
    required: 'This field is required.',
    email: 'Please enter a valid email address.',
    passwordsMismatch: 'Passwords do not match.',
  };

  get shouldShow(): boolean {
    return this.control().invalid && (this.control().dirty || this.control().touched);
  }

  get messages(): string[] {
    const errors = this.control().errors;

    console.log(errors);

    if (!errors) {
      return [];
    }

    const messages: string[] = [];

    for (const [key, value] of Object.entries(errors)) {
      console.log(key, value);
      // Explicit error message is preferred
      if (typeof value === 'string') {
        messages.push(value);
        continue;
      }

      // Messages with dynamic elements
      if (key == 'minlength') {
        messages.push(`Minimum length is ${errors['minlength'].requiredLength} characters.`);
        continue;
      }
      if (key == 'maxlength') {
        messages.push(`Maximum length is ${errors['maxlength'].requiredLength} characters.`);
        continue;
      }

      // Try to get preset error message
      if (key in ValidationErrorsComponent.errorMessages) {
        messages.push(
          ValidationErrorsComponent.errorMessages[
            key as keyof typeof ValidationErrorsComponent.errorMessages
          ],
        );
        continue;
      }
      // For easier debugging, just write key: value
      messages.push(`${key}: ${value}`);
    }

    return messages;
  }
}
