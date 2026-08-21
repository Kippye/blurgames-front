import { Component, inject, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProjectTypeService } from '../project-types/project-type.service';
import { IProjectType } from '../project-types/project-type.types';
import { ProjectTypeCreateModalComponent } from '../project-types/project-type.create-modal.comp';
import { ProjectTypeEditModalComponent } from '../project-types/project-type.edit-modal.comp';
import { ProjectTypeDeleteModalComponent } from '../project-types/project-type.delete-modal.comp';
import { AdminTableComponent, TableColumns } from './admin.table.comp';

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
    } @else if (projectTypesResource.hasValue()) {
      <div>
        <button class="btn btn-primary mb-3" (click)="openCreateModal()">Create</button>
        <app-admin-table
          [items]="projectTypesResource.value().items"
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
export class AdminProjectTypesComponent {
  private readonly projectTypeService = inject(ProjectTypeService);
  private modalService = inject(NgbModal);

  selectedItem = signal<IProjectType | null>(null);

  propertyColumns: TableColumns<IProjectType> = new Map([
    ['projectTypeName', 'Name'],
    ['projectTypeDescription', 'Description'],
  ]);

  projectTypesResource = rxResource({
    stream: () => this.projectTypeService.getPaged({ sort: [{ property: 'projectTypeName' }] }),
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
      () => {
        /* empty */
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
