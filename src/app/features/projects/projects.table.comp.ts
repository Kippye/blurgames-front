import { Component, computed, input } from '@angular/core';
import { IProject, IProjectJoined } from './project.types';
import { IProjectDetails } from '../project-details/project-details.types';

export type TableColumns = Map<keyof IProject | keyof IProjectDetails, string>;

@Component({
  selector: 'app-projects-table',
  template: `
    <table mat-table class="table">
      <thead>
        <tr>
          @for (column of columns(); track column[0]) {
            <th>{{ column[1] }}</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of values(); track $index) {
          <tr>
            @for (column of row; track $index) {
              <td>{{ column }}</td>
            }
          </tr>
        } @empty {
          <tr>
            <td [colSpan]="columns().size" class="text-center">Nothing to display...</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    .number-column {
      width: 4%; /* As small as possible to fit 3-digit numbers */
    }
  `,
})
export class ProjectsTableComponent {
  items = input.required<IProjectJoined[]>();
  columns = input.required<TableColumns>();

  readonly values = computed(() => {
    return this.items().map((i) => {
      const values = [];
      for (const key of this.columns().keys()) {
        if (key in i.project) {
          values.push(i.project[key as keyof IProject]);
        } else if (key in i.projectDetails) {
          values.push(i.projectDetails[key as keyof IProjectDetails]);
        }
      }
      return values;
    });
  });
}
