import { Component, inject, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProjectTypeService } from '../project-types/project-type.service';
import { IProjectType } from '../project-types/project-type.types';
import { ProjectTypeCreateModalComponent } from '../project-types/project-type.create-modal.comp';
import { ProjectTypeEditModalComponent } from '../project-types/project-type.edit-modal.comp';
import { ProjectTypeDeleteModalComponent } from '../project-types/project-type.delete-modal.comp';

@Component({
  selector: 'app-admin-project-types',
  template: `
    <h1>Project Types</h1>

    @if (projectTypesResource.isLoading()) {
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    } @else if (projectTypesResource.error()) {
      <div class="alert alert-danger">
        {{ projectTypesResource.error()?.message }}
      </div>
    } @else {
      <div>
        <button class="btn btn-primary mb-3" (click)="openCreateModal()">Create</button>
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (projectType of projectTypesResource.value(); track projectType.id) {
              <tr>
                <td>{{ projectType.projectTypeName }}</td>
                <td>{{ projectType.projectTypeDescription }}</td>
                <td>
                  <button class="btn btn-primary btn-sm me-2" (click)="openEditModal(projectType)">
                    Edit
                  </button>
                  <button class="btn btn-danger btn-sm" (click)="openDeleteModal(projectType)">
                    Delete
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: ``,
})
export class AdminProjectTypesComponent {
  private readonly projectTypeService = inject(ProjectTypeService);
  private modalService = inject(NgbModal);

  selectedItem = signal<IProjectType | null>(null);

  projectTypesResource = rxResource({
    stream: () => this.projectTypeService.getCollection({ sort: { key: 'projectTypeName' } }),
  });

  refreshData() {
    this.projectTypesResource.reload();
  }

  openCreateModal() {
    this.modalService.open(ProjectTypeCreateModalComponent, { centered: true }).result.then(
      (result) => {
        if (result) {
          this.refreshData();
        }
      },
      (reason) => {
        console.warn(reason);
      },
    );
  }

  openEditModal(projectType: IProjectType) {
    this.selectedItem.set(projectType);
    const modalRef = this.modalService.open(ProjectTypeEditModalComponent, { centered: true });
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

  openDeleteModal(projectType: IProjectType) {
    this.selectedItem.set(projectType);
    const modalRef = this.modalService.open(ProjectTypeDeleteModalComponent, { centered: true });
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
