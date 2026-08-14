import { Component, inject, signal } from '@angular/core';
import { GenreService } from '../genres/genre.service';
import { IGenre } from '../genres/genre.types';
import { GenreCreateModalComponent } from '../genres/genre.create-modal.comp';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { rxResource } from '@angular/core/rxjs-interop';
import { GenreDeleteModalComponent } from '../genres/genre.delete-modal.comp';
import { GenreEditModalComponent } from '../genres/genre.edit-modal.comp';

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
            @for (genre of genresResource.value(); track genre.id) {
              <tr>
                <td>{{ genre.genreName }}</td>
                <td>{{ genre.genreDescription }}</td>
                <td>
                  <button class="btn btn-primary btn-sm me-2" (click)="openEditModal(genre)">
                    Edit
                  </button>
                  <button class="btn btn-danger btn-sm" (click)="openDeleteModal(genre)">
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
export class AdminGenresComponent {
  private readonly genreService = inject(GenreService);
  private modalService = inject(NgbModal);

  selectedGenre = signal<IGenre | null>(null);
  genreToDelete = signal<IGenre | null>(null);

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
      (reason) => {
        console.warn(reason);
      },
    );
  }

  openEditModal(genre: IGenre) {
    this.selectedGenre.set(genre);
    const modalRef = this.modalService.open(GenreEditModalComponent, { centered: true });
    modalRef.componentInstance.itemToEdit = this.selectedGenre();

    modalRef.result.then(
      (result) => {
        if (result) {
          this.refreshData();
          this.selectedGenre.set(null);
        }
      },
      () => {
        this.selectedGenre.set(null);
      },
    );
  }

  openDeleteModal(genre: IGenre) {
    this.genreToDelete.set(genre);
    const modalRef = this.modalService.open(GenreDeleteModalComponent, { centered: true });
    modalRef.componentInstance.itemToDelete = this.genreToDelete();

    modalRef.result.then(
      (result) => {
        if (result) {
          this.refreshData();
          this.genreToDelete.set(null);
        }
      },
      () => {
        this.genreToDelete.set(null);
      },
    );
  }
}
