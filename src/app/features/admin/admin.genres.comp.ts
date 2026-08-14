import { Component, inject, signal } from '@angular/core';
import { GenreService } from '../genres/genre.service';
import { IGenre } from '../genres/genre.types';
import { GenreCreateModalComponent } from '../genres/genre.create-modal.comp';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { rxResource } from '@angular/core/rxjs-interop';
import { GenreDeleteModalComponent } from '../genres/genre.delete-modal.comp';
import { GenreEditModalComponent } from '../genres/genre.edit-modal.comp';
import { TableColumns, AdminTableComponent } from './admin.table.comp';

@Component({
  selector: 'app-admin-genres',
  template: `
    <h1>Genres</h1>

    @if (genresResource.isLoading()) {
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    } @else if (genresResource.error()) {
      <div class="alert alert-danger">
        {{ genresResource.error()?.message }}
      </div>
    } @else if (genresResource.hasValue()) {
      <div>
        <button class="btn btn-primary mb-3" (click)="openCreateModal()">Create</button>
        <app-admin-table
          [items]="genresResource.value()"
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
export class AdminGenresComponent {
  private readonly genreService = inject(GenreService);
  private modalService = inject(NgbModal);

  selectedItem = signal<IGenre | null>(null);

  propertyColumns: TableColumns<IGenre> = new Map([
    ['genreName', 'Name'],
    ['genreDescription', 'Description'],
  ]);

  genresResource = rxResource({
    stream: () => this.genreService.getCollection({ sort: { key: 'genreName' } }),
  });

  refreshData() {
    this.genresResource.reload();
  }

  openCreateModal() {
    this.modalService.open(GenreCreateModalComponent, { centered: true }).result.then(
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

  openEditModal(genre: IGenre) {
    this.selectedItem.set(genre);
    const modalRef = this.modalService.open(GenreEditModalComponent, { centered: true });
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

  openDeleteModal(genre: IGenre) {
    this.selectedItem.set(genre);
    const modalRef = this.modalService.open(GenreDeleteModalComponent, { centered: true });
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
