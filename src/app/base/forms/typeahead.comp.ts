import { JsonPipe } from '@angular/common';
import { Component, inject, input, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbTypeahead,
  NgbTypeaheadConfig,
  NgbTypeaheadSelectItemEvent,
} from '@ng-bootstrap/ng-bootstrap';
import { ProjectDetailsService } from '../../features/project-details/project-details.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-typeahead',
  imports: [NgbTypeahead, FormsModule],
  template: `
    <fieldset>
      <div class="mb-3 row">
        <label for="typeahead-http" class="col-xs-3 col-sm-auto col-form-label"
          >Search for a wiki page:</label
        >
        <div class="col">
          <input
            id="typeahead-http"
            type="text"
            class="form-control"
            [class.is-invalid]="searchFailed"
            /* [value]="text()" */
            /* (selectItem)="selectItem($event)" */
            [ngbTypeahead]="search"
            placeholder="Wikipedia search"
          />
          @if (searching) {
            <small class="form-text text-muted">searching...</small>
          }
          @if (searchFailed) {
            <div class="invalid-feedback">Sorry, suggestions could not be loaded.</div>
          }
        </div>
      </div>
    </fieldset>
  `,
  styles: `
    .form-control {
      width: 300px;
    }
  `,
})
export class NgbdTypeaheadHttp {
  private service = inject(ProjectDetailsService);
  pageSize = input<number>(10);
  selectedItem = signal<string | undefined>(undefined);

  searching = false;
  searchFailed = false;

  selectItem(event: NgbTypeaheadSelectItemEvent) {
    this.selectedItem.set(event.item);
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.service
          .getPaged({
            filter: { property: 'title', operator: 'contains', value: term },
            page: { page: 1, pageSize: this.pageSize() },
          })
          .pipe(
            switchMap((details) => of(details.items.map((i) => i.title))),
            tap(() => (this.searchFailed = false)),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            }),
          ),
      ),
      tap(() => (this.searching = false)),
    );
}
