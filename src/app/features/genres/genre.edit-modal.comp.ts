import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseFormControlComponent } from '../../base/forms/form-control.comp';
import { GenreService } from './genre.service';
import { IGenre } from './genre.types';
import { IResult, ResultFactory } from '../../base/result.types';
import { ValidationErrorsComponent } from '../validation/validation.errors';
import { ModalHeader } from '../../base/modals/modal-header.comp';
import { EditModalFooter } from '../../base/modals/edit-modal-footer.comp';

@Component({
  selector: 'app-genre-add-modal',
  imports: [
    ReactiveFormsModule,
    BaseFormControlComponent,
    ValidationErrorsComponent,
    ModalHeader,
    EditModalFooter,
  ],
  template: `
    <app-modal-header
      action="Edit"
      entityName="Genre"
      (modalClose)="activeModal.dismiss('Closed')"
    />
    <div class="modal-body">
      <form [formGroup]="editForm" (ngSubmit)="updateGenre()">
        <app-form-control id="genreName" label="Name" required>
          <input
            type="text"
            class="form-control"
            id="genreName"
            formControlName="genreName"
            required
          />
        </app-form-control>
        <app-validation-errors [control]="editForm.controls.genreName" [submitted]="submitted()" />

        <app-form-control id="genreDescription" label="Description">
          <textarea class="form-control" id="genreDescription" formControlName="genreDescription">
          </textarea>
        </app-form-control>
      </form>
      @if (editState().error) {
        <div class="alert alert-danger mt-3" role="alert">
          {{ editState().error }}
        </div>
      }
    </div>
    <app-edit-modal-footer
      [isLoading]="editState().loading"
      [isPristine]="editForm.pristine"
      (save)="updateGenre()"
      (modalCancel)="activeModal.close(false)"
    />
  `,
  styles: ``,
})
export class GenreEditModalComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  fb = inject(FormBuilder);
  genreService = inject(GenreService);
  @Input({ required: true }) itemToEdit!: IGenre;

  submitted = signal(false);
  editState = signal<IResult<IGenre>>(ResultFactory.empty());

  editForm = this.fb.nonNullable.group({
    genreName: ['', Validators.required],
    genreDescription: [''],
  });

  prefillForm(): void {
    this.editForm.controls.genreName.setValue(this.itemToEdit.genreName);
    this.editForm.controls.genreDescription.setValue(this.itemToEdit.genreDescription);
  }

  ngOnInit(): void {
    this.prefillForm();
  }

  updateGenre() {
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

    const genreUpdate: IGenre = {
      id: this.itemToEdit.id,
      genreName: this.editForm.controls.genreName.value,
      genreDescription: this.editForm.controls.genreDescription.value,
    };

    this.genreService.update(genreUpdate).subscribe({
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
