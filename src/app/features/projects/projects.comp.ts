import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { BaseFormControlComponent } from '../../base/components/page-selection.comp';
import { IPaged } from '../../base/pagination.types';
import { cachedRxResource } from '../../base/cached-rx-resource';
import { Router } from '@angular/router';
import { ProjectService } from './project.service';
import { ProjectDetailsService } from '../project-details/project-details.service';
import { IProject, IProjectJoined } from './project.types';
import { ProjectsTableComponent, TableColumns } from './projects.table.comp';
import { IProjectDetails } from '../project-details/project-details.types';

@Component({
  selector: 'app-projects',
  imports: [
    ɵInternalFormsSharedModule,
    FormsModule,
    BaseFormControlComponent,
    ProjectsTableComponent,
  ],
  template: `
    <h1>Projects</h1>
    @if (projectsResource.isInitialLoading()) {
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    } @else {
      @if (projectsResource.error()) {
        <div class="alert alert-danger">
          {{ projectsResource.error()?.message }}
        </div>
      } @else if (projectsResource.stableValue(); as data) {
        <app-page-selection
          [currentPage]="page()"
          (changePage)="changePage($event)"
          [pageCount]="data.pageCount"
        />
        <div>
          <app-projects-table [items]="joinedProjects()" [columns]="propertyColumns" />
        </div>
      }
    }
  `,
  styles: ``,
})
export class ProjectsComponent {
  private readonly projectService = inject(ProjectService);
  private readonly detailsService = inject(ProjectDetailsService);
  private router = inject(Router);

  page = input<number, string | number>(1, { transform: (v) => Number(v) });
  selectedItem = signal<IProjectJoined | null>(null);

  firstOrderNumber = computed(
    () => 1 + (this.projectsResource.stableValue()?.pageSize ?? 0) * (this.page() - 1),
  );

  propertyColumns: TableColumns = new Map([
    ['title', 'Title'],
    ['uploaderName', 'Uploader'],
    ['uploadedAt', 'Uploaded at'],
  ]);

  joinedProjects = computed((): IProjectJoined[] => {
    if (this.projectsResource.stableValue() == null || this.detailsResource.stableValue() == null) {
      // TODO: Is this the best behavior?
      return [];
    }

    return this.projectsResource.stableValue()!.items.map((p) => ({
      project: p,
      projectDetails: this.detailsResource.stableValue()!.items.find((d) => d.projectId === p.id)!,
    }));
  });

  changePage(page: number) {
    this.router.navigateByUrl(`/projects/${page}`);
  }

  projectsResource = cachedRxResource<IPaged<IProject>, { page: number }>({
    params: () => ({ page: this.page() }),
    stream: ({ params }) =>
      this.projectService.getPaged({
        sort: [{ property: 'createdAt', order: 'desc' }],
        page: { page: params.page, pageSize: 15 },
      }),
  });

  detailsResource = cachedRxResource<IPaged<IProjectDetails>, IProject[] | undefined>({
    params: ({ chain }) => chain(this.projectsResource)?.items,
    stream: ({ params: items }) =>
      this.detailsService.getPaged({
        filter: {
          logic: 'and',
          conditions: [
            {
              property: 'projectId',
              operator: 'isIn',
              value: items.map((p) => p.id),
            },
            {
              property: 'publishedAt',
              operator: 'isNotNull',
            },
            {
              property: 'activeUntil',
              operator: 'isNull',
            },
          ],
        },
      }),
  });
}
