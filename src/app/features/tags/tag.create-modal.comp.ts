import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormControlComponent } from '../../base/forms/form-control.comp';
import { TagService } from './tag.service';
import { ITag, ITagCreate } from './tag.types';
import { ValidationErrorsComponent } from '../validation/validation.errors';
import { ModalHeader } from '../../base/modals/modal-header.comp';
import { CreateModalFooter } from '../../base/modals/create-modal-footer.comp';
import { CreateModalComponent } from '../../base/modals/create-modal.dir';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tag-create-modal',
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
      entityName="Tag"
      (modalClose)="activeModal.dismiss('Closed')"
    />
    <div class="modal-body">
      <form [formGroup]="createForm" (ngSubmit)="create()">
        <app-form-control inputId="tagName" label="Name" required>
          <input type="text" class="form-control" id="tagName" formControlName="tagName" required />
        </app-form-control>
        <app-validation-errors [control]="createForm.controls.tagName" [submitted]="submitted()" />

        <app-form-control inputId="tagDescription" label="Description">
          <textarea class="form-control" id="tagDescription" formControlName="tagDescription">
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
export class TagCreateModalComponent extends CreateModalComponent<ITag> {
  fb = inject(FormBuilder);
  tagService = inject(TagService);

  createForm = this.fb.nonNullable.group({
    tagName: ['', Validators.required],
    tagDescription: [''],
  });

  override create(): Observable<ITag> {
    const tagCreate: ITagCreate = {
      tagName: this.createForm.controls.tagName.value,
      tagDescription: this.createForm.controls.tagDescription.value,
    };

    return this.tagService.create(tagCreate);
  }
}
