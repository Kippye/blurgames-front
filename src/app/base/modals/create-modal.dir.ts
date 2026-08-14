import { Directive, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IResult, ResultFactory } from '../result.types';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Directive()
export abstract class CreateModalComponent<T> {
  readonly activeModal = inject(NgbActiveModal);
  readonly submitted = signal(false);
  readonly createState = signal<IResult<T>>(ResultFactory.empty());

  abstract createForm: FormGroup;
  /** Create operation to subscribe to on submit */
  abstract create(): Observable<T>;

  submit(): void {
    this.createForm.markAllAsTouched();
    this.submitted.update((v) => !v);

    if (this.createForm.invalid) {
      return;
    }

    this.createState.set(ResultFactory.loading());

    this.create().subscribe({
      next: (created) => {
        this.createState.set(ResultFactory.success(created));
        this.activeModal.close(created);
      },
      error: (error: Error) => {
        this.createState.set(ResultFactory.error(error!.message));
      },
    });
  }
}
