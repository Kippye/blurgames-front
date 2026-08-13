import { Component, inject, signal } from '@angular/core';
import { GenreService } from '../genres/genre.service';
import { IGenre } from '../genres/genre.types';
import { GenreAddModalComponent } from '../genres/genre.add-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { rxResource } from '@angular/core/rxjs-interop';

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
        <button class="btn btn-primary mb-3" (click)="openAddModal()">Add</button>
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

  openAddModal() {
    this.modalService.open(GenreAddModalComponent, { centered: true }).result.then(
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
    this.selectedGenre.set({
      ...genre,
    });
    this.modalService.open(GenreAddModalComponent, { centered: true }).result.then(
      (result) => {
        console.log(result);
        if (result) {
          this.refreshData();
        }
      },
      (reason) => {
        console.warn(reason);
      },
    );
  }

  handleEditModalClose() {
    this.selectedGenre.set(null);
  }

  async handleGenreUpdated() {
    this.refreshData();
  }

  openDeleteModal(genre: IGenre) {
    this.genreToDelete.set(genre);
  }

  handleDeleteModalClose() {
    this.genreToDelete.set(null);
  }

  async handleGenreDeleted() {
    this.refreshData();
  }
}
