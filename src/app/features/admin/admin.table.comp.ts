import { booleanAttribute, Component, input, output } from '@angular/core';
import { IBaseEntity } from '../../base/domain.types';

export type TableColumns<T> = Map<keyof T, string>;

@Component({
  selector: 'app-admin-table',
  template: `
    <table mat-table class="table">
      <thead>
        <tr>
          @if (numberColumn()) {
            <th class="number-column text-muted">#</th>
          }
          @for (column of columns(); track column[0]) {
            <th>{{ column[1] }}</th>
          }
          <th class="text-end actions-column"></th>
        </tr>
      </thead>
      <tbody>
        @for (item of items(); track item.id) {
          <tr>
            @if (numberColumn()) {
              <td class="number-column text-muted">{{ $index + 1 }}</td>
            }
            @for (column of columns(); track column[0]) {
              <td>{{ item[column[0]] }}</td>
            }
            <td class="text-end actions-column">
              <button class="btn btn-primary btn-sm me-2" (click)="editClick.emit(item)">
                Edit
              </button>
              <button class="btn btn-danger btn-sm" (click)="deleteClick.emit(item)">Delete</button>
            </td>
          </tr>
        } @empty {
          <tr>
            <td [colSpan]="columns().size + 1 + (numberColumn() ? 1 : 0)" class="text-center">
              Nothing to display...
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    .number-column {
      width: 1%; /* As small as possible */
    }
    .actions-column {
      width: fit-content; /* Make it only wide enough for its contents */
      white-space: nowrap;
    }
  `,
})
export class AdminTableComponent<T extends IBaseEntity> {
  numberColumn = input(false, { transform: booleanAttribute });
  items = input.required<T[]>();
  columns = input.required<TableColumns<T>>();
  editClick = output<T>();
  deleteClick = output<T>();
}
