import { Component, inject, Input } from '@angular/core';
import { TagService } from './tag.service';
import { ITag } from './tag.types';
import { ModalHeader } from '../../base/modals/modal-header.comp';
import { DeleteModalFooter } from '../../base/modals/delete-modal-footer.comp';
import { DeleteModalComponent } from '../../base/modals/delete-modal.dir';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tag-delete-modal',
  imports: [ModalHeader, DeleteModalFooter],
  template: `
    <app-modal-header
      action="Delete"
      entityName="Tag"
      (modalClose)="activeModal.dismiss('Closed')"
    />
    <div class="modal-body">
      <p>
        Are you sure you want to delete the tag
        <strong>{{ itemToDelete.tagName }}</strong
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
export class TagDeleteModalComponent extends DeleteModalComponent {
  tagService = inject(TagService);
  @Input({ required: true }) itemToDelete!: ITag;

  override delete(): Observable<void> {
    return this.tagService.delete(this.itemToDelete.id);
  }
}
