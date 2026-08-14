import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormControlComponent } from '../../base/forms/form-control.comp';
import { GenreService } from './genre.service';
import { IGenre } from './genre.types';
import { ValidationErrorsComponent } from '../validation/validation.errors';
import { ModalHeader } from '../../base/modals/modal-header.comp';
import { EditModalFooter } from '../../base/modals/edit-modal-footer.comp';
import { EditModalComponent } from '../../base/modals/edit-modal.dir';
import { Observable } from 'rxjs';

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
      <form [formGroup]="editForm" (ngSubmit)="submit()">
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
      (save)="submit()"
      (modalCancel)="activeModal.close(false)"
    />
  `,
  styles: ``,
})
export class GenreEditModalComponent extends EditModalComponent<IGenre> implements OnInit {
  fb = inject(FormBuilder);
  genreService = inject(GenreService);
  @Input({ required: true }) itemToEdit!: IGenre;

  editForm = this.fb.nonNullable.group({
    genreName: ['', Validators.required],
    genreDescription: [''],
  });

  override prefillForm(): void {
    this.editForm.patchValue({
      genreName: this.itemToEdit.genreName,
      genreDescription: this.itemToEdit.genreDescription,
    });
  }

  override saveChanges(): Observable<IGenre> {
    const genreUpdate: IGenre = {
      id: this.itemToEdit.id,
      genreName: this.editForm.controls.genreName.value,
      genreDescription: this.editForm.controls.genreDescription.value,
    };

    return this.genreService.update(genreUpdate);
  }
}
