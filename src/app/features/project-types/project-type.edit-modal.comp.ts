import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormControlComponent } from '../../base/forms/form-control.comp';
import { ProjectTypeService } from './project-type.service';
import { IProjectType } from './project-type.types';
import { ValidationErrorsComponent } from '../validation/validation.errors';
import { ModalHeader } from '../../base/modals/modal-header.comp';
import { EditModalFooter } from '../../base/modals/edit-modal-footer.comp';
import { EditModalComponent } from '../../base/modals/edit-modal.dir';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-type-add-modal',
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
      entityName="Project Type"
      (modalClose)="activeModal.dismiss('Closed')"
    />
    <div class="modal-body">
      <form [formGroup]="editForm" (ngSubmit)="submit()">
        <app-form-control id="projectTypeName" label="Name" required>
          <input
            type="text"
            class="form-control"
            id="projectTypeName"
            formControlName="projectTypeName"
            required
          />
        </app-form-control>
        <app-validation-errors
          [control]="editForm.controls.projectTypeName"
          [submitted]="submitted()"
        />

        <app-form-control id="projectTypeDescription" label="Description">
          <textarea
            class="form-control"
            id="projectTypeDescription"
            formControlName="projectTypeDescription"
          >
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
export class ProjectTypeEditModalComponent
  extends EditModalComponent<IProjectType>
  implements OnInit
{
  fb = inject(FormBuilder);
  projectTypeService = inject(ProjectTypeService);
  @Input({ required: true }) itemToEdit!: IProjectType;

  editForm = this.fb.nonNullable.group({
    projectTypeName: ['', Validators.required],
    projectTypeDescription: [''],
  });

  override prefillForm(): void {
    this.editForm.patchValue({
      projectTypeName: this.itemToEdit.projectTypeName,
      projectTypeDescription: this.itemToEdit.projectTypeDescription,
    });
  }

  override saveChanges(): Observable<IProjectType> {
    const projectTypeUpdate: IProjectType = {
      id: this.itemToEdit.id,
      projectTypeName: this.editForm.controls.projectTypeName.value,
      projectTypeDescription: this.editForm.controls.projectTypeDescription.value,
    };

    return this.projectTypeService.update(projectTypeUpdate);
  }
}
