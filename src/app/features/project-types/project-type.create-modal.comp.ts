import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormControlComponent } from '../../base/forms/form-control.comp';
import { ProjectTypeService } from './project-type.service';
import { IProjectType, IProjectTypeCreate } from './project-type.types';
import { ValidationErrorsComponent } from '../validation/validation.errors';
import { ModalHeader } from '../../base/modals/modal-header.comp';
import { CreateModalFooter } from '../../base/modals/create-modal-footer.comp';
import { CreateModalComponent } from '../../base/modals/create-modal.dir';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-type-create-modal',
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
      entityName="Project Type"
      (modalClose)="activeModal.dismiss('Closed')"
    />
    <div class="modal-body">
      <form [formGroup]="createForm" (ngSubmit)="create()">
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
          [control]="createForm.controls.projectTypeName"
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
export class ProjectTypeCreateModalComponent extends CreateModalComponent<IProjectType> {
  fb = inject(FormBuilder);
  projectTypeService = inject(ProjectTypeService);

  createForm = this.fb.nonNullable.group({
    projectTypeName: ['', Validators.required],
    projectTypeDescription: [''],
  });

  override create(): Observable<IProjectType> {
    const projectTypeCreate: IProjectTypeCreate = {
      projectTypeName: this.createForm.controls.projectTypeName.value,
      projectTypeDescription: this.createForm.controls.projectTypeDescription.value,
    };

    return this.projectTypeService.create(projectTypeCreate);
  }
}
