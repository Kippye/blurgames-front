import { Component, inject, Input, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GenreService } from './genre.service';
import { IGenre } from './genre.types';
import { IResult, ResultFactory } from '../../base/result.types';
import { ModalHeader } from '../../base/modals/modal-header.comp';
import { DeleteModalFooter } from '../../base/modals/delete-modal-footer.comp';

@Component({
  selector: 'app-genre-delete-modal',
  imports: [ModalHeader, DeleteModalFooter],
  template: `
    <app-modal-header
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
      (delete)="deleteGenre()"
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

  deleteGenre() {
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
