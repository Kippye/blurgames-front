import { Component, inject, Input, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GenreService } from './genre.service';
import { IGenre } from './genre.types';
import { IResult, ResultFactory } from '../../base/base.types';
import { BaseAddModalHeader } from '../../base/components/modal-header.component';
import { BaseDeleteModalFooter } from '../../base/components/delete-modal-footer.component';

@Component({
  selector: 'app-genre-delete-modal',
  imports: [BaseAddModalHeader, BaseDeleteModalFooter],
  template: `
    <app-add-modal-header
      action="Delete"
      entityName="Genre"
      (modalClose)="activeModal.dismiss('Closed')"
    />
    <div class="modal-body">
      <p>
        Are you sure you want to delete the genre
        {{ itemToDelete.genreName }}?
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
      (delete)="handleDelete()"
      (modalCancel)="activeModal.close(false)"
    />
  `,
  styles: ``,
})
export class GenreDeleteModalComponent {
  activeModal = inject(NgbActiveModal);
  genreService = inject(GenreService);
  @Input({ required: true }) itemToDelete!: IGenre;

  deleteState = signal<IResult<void>>(ResultFactory.empty());

  handleDelete() {
    this.deleteState.set(ResultFactory.loading());

    this.genreService.delete(this.itemToDelete.id).subscribe({
      next: () => {
        // NOTE: Delete returns no data, so we just revert to empty
        this.deleteState.set(ResultFactory.empty());
        this.activeModal.close(true);
      },
      error: (error: Error) => {
        this.deleteState.set(ResultFactory.error(error!.message));
      },
    });
  }
}
