import { Component, computed, inject, input, signal } from '@angular/core';
import { GenreService } from '../genres/genre.service';
import { IGenre } from '../genres/genre.types';
import { GenreCreateModalComponent } from '../genres/genre.create-modal.comp';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenreDeleteModalComponent } from '../genres/genre.delete-modal.comp';
import { GenreEditModalComponent } from '../genres/genre.edit-modal.comp';
import { TableColumns, AdminTableComponent } from './admin.table.comp';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { BaseFormControlComponent } from '../../base/components/page-selection.comp';
import { IPaged } from '../../base/pagination.types';
import { cachedRxResource } from '../../base/cached-rx-resource';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-genres',
  imports: [AdminTableComponent, ɵInternalFormsSharedModule, FormsModule, BaseFormControlComponent],
  template: `
    <h1>Genres</h1>
    @if (genresResource.isInitialLoading()) {
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    } @else {
      @if (genresResource.error()) {
        <div class="alert alert-danger">
          {{ genresResource.error()?.message }}
        </div>
      } @else if (genresResource.stableValue(); as data) {
        <app-page-selection
          [currentPage]="page()"
          (changePage)="changePage($event)"
          [pageCount]="data.pageCount"
        />
        <div>
          <button class="btn btn-primary mb-3" (click)="openCreateModal()">Create</button>
          <app-admin-table
            [items]="data.items"
            [columns]="propertyColumns"
            (editClick)="openEditModal($event)"
            (deleteClick)="openDeleteModal($event)"
            numberColumn
            [startingNumber]="firstOrderNumber()"
          />
        </div>
      }
    }
  `,
  styles: ``,
})
export class AdminGenresComponent {
  private readonly genreService = inject(GenreService);
  private modalService = inject(NgbModal);
  private router = inject(Router);

  page = input<number, string | number>(1, { transform: (v) => Number(v) });
  selectedItem = signal<IGenre | null>(null);

  firstOrderNumber = computed(
    () => 1 + (this.genresResource.stableValue()?.pageSize ?? 0) * (this.page() - 1),
  );

  propertyColumns: TableColumns<IGenre> = new Map([
    ['genreName', 'Name'],
    ['genreDescription', 'Description'],
  ]);

  changePage(page: number) {
    this.router.navigateByUrl(`/admin/genres/${page}`);
  }

  genresResource = cachedRxResource<IPaged<IGenre>, { page: number }>({
    params: () => ({ page: this.page() }),
    stream: ({ params }) =>
      this.genreService.getPaged({
        sort: [{ property: 'genreName' }],
        page: { page: params.page, pageSize: 4 },
      }),
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
