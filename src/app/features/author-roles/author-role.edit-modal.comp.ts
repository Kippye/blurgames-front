import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormControlComponent } from '../../base/forms/form-control.comp';
import { AuthorRoleService } from './author-role.service';
import { IAuthorRole } from './author-role.types';
import { ValidationErrorsComponent } from '../validation/validation.errors';
import { ModalHeader } from '../../base/modals/modal-header.comp';
import { EditModalFooter } from '../../base/modals/edit-modal-footer.comp';
import { EditModalComponent } from '../../base/modals/edit-modal.dir';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-author-role-add-modal',
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
      entityName="Author Role"
      (modalClose)="activeModal.dismiss('Closed')"
    />
    <div class="modal-body">
      <form [formGroup]="editForm" (ngSubmit)="submit()">
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
          [control]="editForm.controls.authorRoleName"
          [submitted]="submitted()"
        />
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
export class AuthorRoleEditModalComponent
  extends EditModalComponent<IAuthorRole>
  implements OnInit
{
  fb = inject(FormBuilder);
  authorRoleService = inject(AuthorRoleService);
  @Input({ required: true }) itemToEdit!: IAuthorRole;

  editForm = this.fb.nonNullable.group({
    authorRoleName: ['', Validators.required],
  });

  override prefillForm(): void {
    this.editForm.patchValue({
      authorRoleName: this.itemToEdit.authorRoleName,
    });
  }

  override saveChanges(): Observable<IAuthorRole> {
    const authorRoleUpdate: IAuthorRole = {
      id: this.itemToEdit.id,
      authorRoleName: this.editForm.controls.authorRoleName.value,
    };

    return this.authorRoleService.update(authorRoleUpdate);
  }
}
