import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormControlComponent } from '../../base/forms/form-control.comp';
import { TagService } from './tag.service';
import { ITag } from './tag.types';
import { ValidationErrorsComponent } from '../validation/validation.errors';
import { ModalHeader } from '../../base/modals/modal-header.comp';
import { EditModalFooter } from '../../base/modals/edit-modal-footer.comp';
import { EditModalComponent } from '../../base/modals/edit-modal.dir';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tag-add-modal',
  imports: [
    ReactiveFormsModule,
    BaseFormControlComponent,
    ValidationErrorsComponent,
    ModalHeader,
    EditModalFooter,
  ],
  template: `
    <app-modal-header action="Edit" entityName="Tag" (modalClose)="activeModal.dismiss('Closed')" />
    <div class="modal-body">
      <form [formGroup]="editForm" (ngSubmit)="submit()">
        <app-form-control id="tagName" label="Name" required>
          <input type="text" class="form-control" id="tagName" formControlName="tagName" required />
        </app-form-control>
        <app-validation-errors [control]="editForm.controls.tagName" [submitted]="submitted()" />

        <app-form-control id="tagDescription" label="Description">
          <textarea class="form-control" id="tagDescription" formControlName="tagDescription">
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
export class TagEditModalComponent extends EditModalComponent<ITag> implements OnInit {
  fb = inject(FormBuilder);
  tagService = inject(TagService);
  @Input({ required: true }) itemToEdit!: ITag;

  editForm = this.fb.nonNullable.group({
    tagName: ['', Validators.required],
    tagDescription: [''],
  });

  override prefillForm(): void {
    this.editForm.patchValue({
      tagName: this.itemToEdit.tagName,
      tagDescription: this.itemToEdit.tagDescription,
    });
  }

  override saveChanges(): Observable<ITag> {
    const tagUpdate: ITag = {
      id: this.itemToEdit.id,
      tagName: this.editForm.controls.tagName.value,
      tagDescription: this.editForm.controls.tagDescription.value,
    };

    return this.tagService.update(tagUpdate);
  }
}
