import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseFormControlComponent } from '../../base/base.form-control.component';
import { GenreService } from './genre.service';
import { IGenre, IGenreCreate } from './genre.types';
import { IResult, ResultFactory } from '../../base/base.types';
import { ValidationErrorsComponent } from '../validation/validation.errors';
import { BaseAddModalHeader } from '../../base/components/modal-header.component';
import { BaseAddModalFooter } from '../../base/components/add-modal-footer.component';

@Component({
  selector: 'app-genre-add-modal',
  imports: [
    ReactiveFormsModule,
    BaseFormControlComponent,
    ValidationErrorsComponent,
    BaseAddModalHeader,
    BaseAddModalFooter,
  ],
  template: `
    <app-add-modal-header
      action="Add new"
      entityName="Genre"
      (modalClose)="activeModal.dismiss('Closed')"
    />
    <div class="modal-body">
      <form [formGroup]="addForm" (ngSubmit)="handleCreate()">
        <app-form-control id="genreName" label="Name" required>
          <input
            type="text"
            class="form-control"
            id="genreName"
            formControlName="genreName"
            required
          />
        </app-form-control>
        <app-validation-errors [control]="addForm.controls.genreName" [submitted]="submitted()" />

        <app-form-control id="genreDescription" label="Description">
          <textarea class="form-control" id="genreDescription" formControlName="genreDescription">
          </textarea>
        </app-form-control>
      </form>
      @if (createState().error) {
        <div class="alert alert-danger mt-3" role="alert">
          {{ createState().error }}
        </div>
      }
    </div>
    <app-add-modal-footer
      [isLoading]="createState().loading"
      (create)="handleCreate()"
      (modalCancel)="activeModal.close(false)"
    />
  `,
  styles: ``,
})
export class GenreAddModalComponent {
  activeModal = inject(NgbActiveModal);
  fb = inject(FormBuilder);
  genreService = inject(GenreService);

  submitted = signal(false);
  createState = signal<IResult<IGenre>>(ResultFactory.empty());

  addForm = this.fb.nonNullable.group({
    genreName: ['', Validators.required],
    genreDescription: [''],
  });

  handleCreate() {
    this.addForm.markAllAsTouched();
    this.submitted.update((v) => !v);
    if (this.addForm.invalid) {
      return;
    }

    this.createState.set(ResultFactory.loading());

    const genreCreate: IGenreCreate = {
      genreName: this.addForm.controls.genreName.value,
      genreDescription: this.addForm.controls.genreDescription.value,
    };

    this.genreService.create(genreCreate).subscribe({
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
