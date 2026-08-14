import { Directive, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { IResult, ResultFactory } from '../result.types';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Directive()
export abstract class DeleteModalComponent {
  readonly activeModal = inject(NgbActiveModal);
  readonly deleteState = signal<IResult<void>>(ResultFactory.empty());

  /** Delete operation to subscribe to on submit */
  abstract delete(): Observable<void>;

  submit(): void {
    this.deleteState.set(ResultFactory.loading());

    this.delete().subscribe({
      next: () => {
        // NOTE: Delete returns no data, so we just revert to empty
        this.deleteState.set(ResultFactory.empty());
        this.activeModal.close(true);
      },
      error: (error: Error) => {
        this.deleteState.set(ResultFactory.error(error!.message));
      },
    });
  }
}
