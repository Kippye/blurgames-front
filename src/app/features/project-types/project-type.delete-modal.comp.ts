import { Component, inject, Input } from '@angular/core';
import { ProjectTypeService } from './project-type.service';
import { IProjectType } from './project-type.types';
import { ModalHeader } from '../../base/modals/modal-header.comp';
import { DeleteModalFooter } from '../../base/modals/delete-modal-footer.comp';
import { DeleteModalComponent } from '../../base/modals/delete-modal.dir';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-type-delete-modal',
  imports: [ModalHeader, DeleteModalFooter],
  template: `
    <app-modal-header
      action="Delete"
      entityName="Project Type"
      (modalClose)="activeModal.dismiss('Closed')"
    />
    <div class="modal-body">
      <p>
        Are you sure you want to delete the project type
        <strong>{{ itemToDelete.projectTypeName }}</strong
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
export class ProjectTypeDeleteModalComponent extends DeleteModalComponent {
  projectTypeService = inject(ProjectTypeService);
  @Input({ required: true }) itemToDelete!: IProjectType;

  override delete(): Observable<void> {
    return this.projectTypeService.delete(this.itemToDelete.id);
  }
}
