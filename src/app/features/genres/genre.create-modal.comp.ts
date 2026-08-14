import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormControlComponent } from '../../base/forms/form-control.comp';
import { GenreService } from './genre.service';
import { IGenre, IGenreCreate } from './genre.types';
import { ValidationErrorsComponent } from '../validation/validation.errors';
import { ModalHeader } from '../../base/modals/modal-header.comp';
import { CreateModalFooter } from '../../base/modals/create-modal-footer.comp';
import { CreateModalComponent } from '../../base/modals/create-modal.dir';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-genre-create-modal',
  imports: [
    ReactiveFormsModule,
    BaseFormControlComponent,
    ValidationErrorsComponent,
    ModalHeader,
    CreateModalFooter,
  ],
  template: `
    <app-modal-header
      action="Create"
      entityName="Genre"
      (modalClose)="activeModal.dismiss('Closed')"
    />
    <div class="modal-body">
      <form [formGroup]="createForm" (ngSubmit)="create()">
        <app-form-control id="genreName" label="Name" required>
          <input
            type="text"
            class="form-control"
            id="genreName"
            formControlName="genreName"
            required
          />
        </app-form-control>
        <app-validation-errors
          [control]="createForm.controls.genreName"
          [submitted]="submitted()"
        />

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
    <app-create-modal-footer
      [isLoading]="createState().loading"
      (create)="submit()"
      (modalCancel)="activeModal.close(false)"
    />
  `,
  styles: ``,
})
export class GenreCreateModalComponent extends CreateModalComponent<IGenre> {
  fb = inject(FormBuilder);
  genreService = inject(GenreService);

  createForm = this.fb.nonNullable.group({
    genreName: ['', Validators.required],
    genreDescription: [''],
  });

  override create(): Observable<IGenre> {
    const genreCreate: IGenreCreate = {
      genreName: this.createForm.controls.genreName.value,
      genreDescription: this.createForm.controls.genreDescription.value,
    };

    return this.genreService.create(genreCreate);
  }
}
