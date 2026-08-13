import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseFormControlComponent } from '../../base/base.form-control.component';
import { GenreService } from './genre.service';
import { IGenre, IGenreCreate } from './genre.types';
import { EmptyResult, IResult, LoadingResult } from '../../base/base.types';
import { ValidationErrorsComponent } from '../validation/validation.errors';

@Component({
  selector: 'app-genre-add-modal',
  imports: [ReactiveFormsModule, BaseFormControlComponent, ValidationErrorsComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title" id="addGenreModalLabel">Add New Genre</h5>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="activeModal.dismiss('Closed')"
      ></button>
    </div>
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
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close(false)">
        Cancel
      </button>
      <button
        type="button"
        class="btn btn-primary"
        (click)="handleCreate()"
        [disabled]="createState().loading"
      >
        @if (createState().loading) {
          <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          Creating...
        } @else {
          Create
        }
      </button>
    </div>
  `,
  styles: ``,
})
export class GenreAddModalComponent {
  activeModal = inject(NgbActiveModal);
  fb = inject(FormBuilder);
  genreService = inject(GenreService);

  submitted = signal(false);

  createState = signal<IResult<IGenre>>(new EmptyResult<IGenre>());

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

    this.createState.set(new LoadingResult<IGenre>());

    const genreCreate: IGenreCreate = {
      genreName: this.addForm.controls.genreName.value,
      genreDescription: this.addForm.controls.genreDescription.value,
    };

    this.genreService.create(genreCreate).subscribe({
      next: (created) => {
        this.createState.set({
          loading: false,
          data: created,
          error: null,
        });
        this.activeModal.close(created);
      },
      error: (error: Error) => {
        console.log(error.message);
        this.createState.set({
          loading: false,
          data: null,
          error: error!.message,
        });
      },
    });
  }
}
