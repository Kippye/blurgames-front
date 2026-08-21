import { Component, inject, signal } from '@angular/core';
import { AuthorRoleService } from '../author-roles/author-role.service';
import { IAuthorRole } from '../author-roles/author-role.types';
import { AuthorRoleCreateModalComponent } from '../author-roles/author-role.create-modal.comp';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthorRoleDeleteModalComponent } from '../author-roles/author-role.delete-modal.comp';
import { AuthorRoleEditModalComponent } from '../author-roles/author-role.edit-modal.comp';
import { TableColumns, AdminTableComponent } from './admin.table.comp';

@Component({
  selector: 'app-admin-author-roles',
  template: `
    <h1>Author Roles</h1>

    @if (authorRolesResource.isLoading()) {
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    } @else if (authorRolesResource.error()) {
      <div class="alert alert-danger">
        {{ authorRolesResource.error()?.message }}
      </div>
    } @else if (authorRolesResource.hasValue()) {
      <div>
        <button class="btn btn-primary mb-3" (click)="openCreateModal()">Create</button>
        <app-admin-table
          [items]="authorRolesResource.value().items"
          [columns]="propertyColumns"
          (editClick)="openEditModal($event)"
          (deleteClick)="openDeleteModal($event)"
          numberColumn
        />
      </div>
    }
  `,
  styles: ``,
  imports: [AdminTableComponent],
})
export class AdminAuthorRolesComponent {
  private readonly authorRoleService = inject(AuthorRoleService);
  private modalService = inject(NgbModal);

  selectedItem = signal<IAuthorRole | null>(null);

  propertyColumns: TableColumns<IAuthorRole> = new Map([['authorRoleName', 'Name']]);

  authorRolesResource = rxResource({
    stream: () => this.authorRoleService.getPaged({ sort: [{ property: 'authorRoleName' }] }),
  });

  refreshData() {
    this.authorRolesResource.reload();
  }

  openCreateModal() {
    this.modalService.open(AuthorRoleCreateModalComponent, { centered: true }).result.then(
      (result) => {
        if (result) {
          this.refreshData();
        }
      },
      () => {
        /* empty */
      },
    );
  }

  openEditModal(authorRole: IAuthorRole) {
    this.selectedItem.set(authorRole);
    const modalRef = this.modalService.open(AuthorRoleEditModalComponent, { centered: true });
    modalRef.componentInstance.itemToEdit = this.selectedItem();

    modalRef.result.then(
      (result) => {
        if (result) {
          this.refreshData();
          this.selectedItem.set(null);
        }
      },
      () => {
        this.selectedItem.set(null);
      },
    );
  }

  openDeleteModal(authorRole: IAuthorRole) {
    this.selectedItem.set(authorRole);
    const modalRef = this.modalService.open(AuthorRoleDeleteModalComponent, { centered: true });
    modalRef.componentInstance.itemToDelete = this.selectedItem();

    modalRef.result.then(
      (result) => {
        if (result) {
          this.refreshData();
          this.selectedItem.set(null);
        }
      },
      () => {
        this.selectedItem.set(null);
      },
    );
  }
}
