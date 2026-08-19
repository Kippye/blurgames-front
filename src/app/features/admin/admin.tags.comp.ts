import { Component, inject, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { rxResource } from '@angular/core/rxjs-interop';
import { TagService } from '../tags/tag.service';
import { ITag } from '../tags/tag.types';
import { TagCreateModalComponent } from '../tags/tag.create-modal.comp';
import { TagEditModalComponent } from '../tags/tag.edit-modal.comp';
import { TagDeleteModalComponent } from '../tags/tag.delete-modal.comp';
import { TableColumns, AdminTableComponent } from './admin.table.comp';

@Component({
  selector: 'app-admin-tags',
  template: `
    <h1>Tags</h1>

    @if (tagsResource.isLoading()) {
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    } @else if (tagsResource.error()) {
      <div class="alert alert-danger">
        {{ tagsResource.error()?.message }}
      </div>
    } @else if (tagsResource.hasValue()) {
      <div>
        <button class="btn btn-primary mb-3" (click)="openCreateModal()">Create</button>
        <app-admin-table
          [items]="tagsResource.value()"
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
export class AdminTagsComponent {
  private readonly tagService = inject(TagService);
  private modalService = inject(NgbModal);

  selectedItem = signal<ITag | null>(null);

  propertyColumns: TableColumns<ITag> = new Map([
    ['tagName', 'Name'],
    ['tagDescription', 'Description'],
  ]);

  tagsResource = rxResource({
    stream: () => this.tagService.getCollection({ sort: [{ property: 'tagName' }] }),
  });

  refreshData() {
    this.tagsResource.reload();
  }

  openCreateModal() {
    this.modalService.open(TagCreateModalComponent, { centered: true }).result.then(
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

  openEditModal(tag: ITag) {
    this.selectedItem.set(tag);
    const modalRef = this.modalService.open(TagEditModalComponent, { centered: true });
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

  openDeleteModal(tag: ITag) {
    this.selectedItem.set(tag);
    const modalRef = this.modalService.open(TagDeleteModalComponent, { centered: true });
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
