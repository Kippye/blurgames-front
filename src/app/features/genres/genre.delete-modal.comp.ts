import { Component, inject, Input } from '@angular/core';
import { GenreService } from './genre.service';
import { IGenre } from './genre.types';
import { ModalHeader } from '../../base/modals/modal-header.comp';
import { DeleteModalFooter } from '../../base/modals/delete-modal-footer.comp';
import { DeleteModalComponent } from '../../base/modals/delete-modal.dir';
import { Observable } from 'rxjs';

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
        <strong>{{ itemToDelete.genreName }}</strong
        >?
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
      (delete)="submit()"
      (modalCancel)="activeModal.close(false)"
    />
  `,
  styles: ``,
})
export class GenreDeleteModalComponent extends DeleteModalComponent {
  genreService = inject(GenreService);
  @Input({ required: true }) itemToDelete!: IGenre;

  override delete(): Observable<void> {
    return this.genreService.delete(this.itemToDelete.id);
  }
}
