import { Directive, inject, OnInit, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IResult, ResultFactory } from '../result.types';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Directive()
export abstract class EditModalComponent<T> implements OnInit {
  readonly activeModal = inject(NgbActiveModal);
  readonly submitted = signal(false);
  readonly editState = signal<IResult<T>>(ResultFactory.empty());

  abstract editForm: FormGroup;
  abstract prefillForm(): void;
  /** Save operation to subscribe to on submit */
  abstract saveChanges(): Observable<T>;

  ngOnInit(): void {
    this.prefillForm();
  }

  submit(): void {
    // Don't allow updating when nothing was changed - pointless request
    if (this.editForm.pristine) {
      return;
    }

    this.editForm.markAllAsTouched();
    this.submitted.update((v) => !v);

    if (this.editForm.invalid) {
      return;
    }

    this.editState.set(ResultFactory.loading());

    this.saveChanges().subscribe({
      next: (updated) => {
        this.editState.set(ResultFactory.success(updated));
        this.activeModal.close(updated);
      },
      error: (error: Error) => {
        this.editState.set(ResultFactory.error(error!.message));
      },
    });
  }
}
