import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { ValidationErrorsComponent } from '../validation/validation.errors';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, ValidationErrorsComponent],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-4">
        <h2>Register</h2>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <input
            id="username"
            type="text"
            class="form-control mb-2"
            required
            placeholder="Username"
            formControlName="userName"
            [class.is-invalid]="form.get('userName')?.touched && form.controls.userName.invalid"
          />
          <app-validation-errors [control]="form.controls.userName" [submitted]="submitted()" />
          <input
            id="email"
            type="email"
            class="form-control mb-2"
            required
            placeholder="Email"
            formControlName="email"
            autocomplete="username"
            [class.is-invalid]="form.get('email')?.touched && form.controls.email.invalid"
          />
          <app-validation-errors [control]="form.controls.email" [submitted]="submitted()" />
          <input
            id="password"
            type="password"
            class="form-control mb-2"
            required
            placeholder="Password"
            formControlName="password"
            [class.is-invalid]="form.get('password')?.touched && form.controls.password.invalid"
          />
          <app-validation-errors [control]="form.controls.password" [submitted]="submitted()" />
          <input
            id="password-confirmation"
            type="password"
            class="form-control mb-2"
            required
            placeholder="Confirm password"
            formControlName="passwordConfirmation"
            [class.is-invalid]="
              form.get('passwordConfirmation')?.touched &&
              form.controls.passwordConfirmation.invalid
            "
          />
          <app-validation-errors
            [control]="form.controls.passwordConfirmation"
            [submitted]="submitted()"
          />
          @if (registrationError()) {
            <div class="alert alert-danger">
              {{ registrationError() }}
            </div>
          }
          <div>
            <button type="submit" class="btn btn-primary bg-gradient btn-block w-100 mb-4">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
  `,
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  submitted = signal(false);
  readonly registrationError = signal<string | null>(null);

  createPasswordMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')!;
      const confirmation = group.get('passwordConfirmation')!;

      if (password.value === confirmation.value) {
        if (confirmation.errors != null) {
          // Remove only passwords mismatch error
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { passwordsMismatch, ...otherErrors } = confirmation.errors;
          confirmation?.setErrors(otherErrors);
        }
        return null;
      }

      confirmation.setErrors({
        ...confirmation.errors,
        passwordsMismatch: true,
      });

      return { passwordsMismatch: true };
    };
  }

  // TODO: This doesn't reactively re-render validation errors.
  // Only updates it once
  readonly form = this.fb.nonNullable.group(
    {
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      passwordConfirmation: ['', [Validators.required]],
    },
    { validators: this.createPasswordMatchValidator() },
  );

  submit(): void {
    this.form.markAllAsTouched();
    this.submitted.update((v) => !v);
    if (this.form.invalid) {
      return;
    }

    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => this.registrationError.set(err.message),
    });
  }
}
