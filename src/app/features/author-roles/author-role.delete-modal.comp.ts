import { Component, inject, Input } from '@angular/core';
import { AuthorRoleService } from './author-role.service';
import { IAuthorRole } from './author-role.types';
import { ModalHeader } from '../../base/modals/modal-header.comp';
import { DeleteModalFooter } from '../../base/modals/delete-modal-footer.comp';
import { DeleteModalComponent } from '../../base/modals/delete-modal.dir';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-author-role-delete-modal',
  imports: [ModalHeader, DeleteModalFooter],
  template: `
    <app-modal-header
      action="Delete"
      entityName="Author Role"
      (modalClose)="activeModal.dismiss('Closed')"
    />
    <div class="modal-body">
      <p>
        Are you sure you want to delete the author role
        <strong>{{ itemToDelete.authorRoleName }}</strong
        >?
      </p>
      <p class="text-muted">This action cannot be undone.</p>
      @if (deleteState().error) {
        <div class="alert alert-danger mt-3" role="alert">
          {{ deleteState().error }}
        </div>
      }
    </div>
    <app-delete-modal-footer
      [isLoading]="deleteState().loading"
      (delete)="submit()"
      (modalCancel)="activeModal.close(false)"
    />
  `,
  styles: ``,
})
export class AuthorRoleDeleteModalComponent extends DeleteModalComponent {
  authorRoleService = inject(AuthorRoleService);
  @Input({ required: true }) itemToDelete!: IAuthorRole;

  override delete(): Observable<void> {
    return this.authorRoleService.delete(this.itemToDelete.id);
  }
}
