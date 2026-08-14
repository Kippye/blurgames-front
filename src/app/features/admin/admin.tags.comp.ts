import { Component, inject, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { rxResource } from '@angular/core/rxjs-interop';
import { TagService } from '../tags/tag.service';
import { ITag } from '../tags/tag.types';
import { TagCreateModalComponent } from '../tags/tag.create-modal.comp';
import { TagEditModalComponent } from '../tags/tag.edit-modal.comp';
import { TagDeleteModalComponent } from '../tags/tag.delete-modal.comp';

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
            @for (tag of tagsResource.value(); track tag.id) {
              <tr>
                <td>{{ tag.tagName }}</td>
                <td>{{ tag.tagDescription }}</td>
                <td>
                  <button class="btn btn-primary btn-sm me-2" (click)="openEditModal(tag)">
                    Edit
                  </button>
                  <button class="btn btn-danger btn-sm" (click)="openDeleteModal(tag)">
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
export class AdminTagsComponent {
  private readonly tagService = inject(TagService);
  private modalService = inject(NgbModal);

  selectedItem = signal<ITag | null>(null);

  tagsResource = rxResource({
    stream: () => this.tagService.getCollection({ sort: { key: 'tagName' } }),
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
      (reason) => {
        console.warn(reason);
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
