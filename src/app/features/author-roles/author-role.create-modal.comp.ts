import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormControlComponent } from '../../base/forms/form-control.comp';
import { AuthorRoleService } from './author-role.service';
import { IAuthorRole, IAuthorRoleCreate } from './author-role.types';
import { ValidationErrorsComponent } from '../validation/validation.errors';
import { ModalHeader } from '../../base/modals/modal-header.comp';
import { CreateModalFooter } from '../../base/modals/create-modal-footer.comp';
import { CreateModalComponent } from '../../base/modals/create-modal.dir';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-author-role-create-modal',
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
      entityName="Author Role"
      (modalClose)="activeModal.dismiss('Closed')"
    />
    <div class="modal-body">
      <form [formGroup]="createForm" (ngSubmit)="create()">
        <app-form-control id="authorRoleName" label="Name" required>
          <input
            type="text"
            class="form-control"
            id="authorRoleName"
            formControlName="authorRoleName"
            required
          />
        </app-form-control>
        <app-validation-errors
          [control]="createForm.controls.authorRoleName"
          [submitted]="submitted()"
        />
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
export class AuthorRoleCreateModalComponent extends CreateModalComponent<IAuthorRole> {
  fb = inject(FormBuilder);
  authorRoleService = inject(AuthorRoleService);

  createForm = this.fb.nonNullable.group({
    authorRoleName: ['', Validators.required],
  });

  override create(): Observable<IAuthorRole> {
    const authorRoleCreate: IAuthorRoleCreate = {
      authorRoleName: this.createForm.controls.authorRoleName.value,
    };

    return this.authorRoleService.create(authorRoleCreate);
  }
}
