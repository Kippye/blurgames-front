import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { ValidationErrorsComponent } from '../validation/validation.errors';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ValidationErrorsComponent],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-4">
        <h2>Login</h2>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <input
            id="email"
            type="email"
            class="form-control mb-2"
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
            placeholder="Password"
            formControlName="password"
            autocomplete="current-password"
            [class.is-invalid]="form.get('password')?.touched && form.controls.password.invalid"
          />
          <app-validation-errors [control]="form.controls.password" [submitted]="submitted()" />
          @if (loginError()) {
            <div class="alert alert-danger">
              {{ loginError() }}
            </div>
          }
          <div>
            <button type="submit" class="btn btn-primary bg-gradient btn-block w-100 mb-4">
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly submitted = signal(false);
  readonly loginError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    this.form.markAllAsTouched();
    this.submitted.update((v) => !v);
    if (this.form.invalid) {
      return;
    }

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => this.loginError.set(err.message),
    });
  }
}
