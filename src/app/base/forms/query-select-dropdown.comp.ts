import {
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { IBaseEntity } from '../domain.types';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownAnchor } from '@ng-bootstrap/ng-bootstrap';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  OperatorFunction,
  switchMap,
} from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { cachedRxResource } from '../cached-rx-resource';

@Component({
  selector: 'app-query-select-dropdown',
  imports: [FormsModule, NgbDropdown, NgbDropdownMenu, NgbDropdownAnchor, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuerySelectDropdownComponent),
      multi: true,
    },
  ],
  template: `
    @if (!hideSelected()) {
      <div class="selected-items mb-2">
        @for (id_item of selectedItems(); track id_item[0]) {
          <span [class]="itemClass() + ' me-1 md-1 d-inline-flex align-items-center'">
            {{ id_item[1][nameProperty()] }}
            <button
              type="button"
              class="btn-close btn-close-white ms-1"
              (click)="removeItem(id_item[0])"
              [aria-label]="'Remove' + id_item[1][nameProperty()]"
            ></button>
          </span>
        } @empty {
          <span class="text-muted"> None selected </span>
        }
      </div>
    }

    <div
      ngbDropdown
      placement="bottom-start"
      class="item-search-dropdown"
      (focusout)="handleFocusOut($event)"
      #drop="ngbDropdown"
      #dropEl
    >
      <div class="input-group">
        <input
          [id]="inputId()"
          ngbDropdownAnchor
          type="text"
          role="combobox"
          class="form-control"
          autocomplete="off"
          [disabled]="isDisabled()"
          [(ngModel)]="searchQuery"
          [placeholder]="placeholder()"
          (ngModelChange)="handleQueryEdit()"
          (keydown.arrowdown)="handleMoveSelection($event)"
          (keydown.arrowup)="handleMoveSelection($event)"
          (keydown.enter)="handleSubmit($event)"
          (keydown.escape)="handleEscape($event)"
          [aria-expanded]="drop.isOpen()"
          [aria-controls]="inputId() + '-menu'"
          [attr.aria-activedescendant]="getOptionId(highlightedItemIndex())"
        />
      </div>
      <div [id]="inputId() + '-menu'" ngbDropdownMenu role="listbox" class="dropdown-menu w-100">
        @if (!searchResults.error() && searchResults.value() !== null) {
          @for (item of searchResults.value(); track item.id) {
            <button
              [id]="getOptionId($index)"
              tabindex="-1"
              type="button"
              role="option"
              ngbDropdownItem
              class="dropdown-item no-decoration"
              [class.active]="$index === highlightedItemIndex()"
              (click)="addItem(item)"
              (mouseenter)="handleMouseEnterOption($event, $index)"
              [aria-selected]="$index === highlightedItemIndex()"
            >
              <div class="item-name">{{ item[nameProperty()] }}</div>
            </button>
          } @empty {
            <span ngbDropdownItem class="dropdown-item text-muted">No results found</span>
          }
        } @else if (searchResults.error()) {
          <span ngbDropdownItem class="dropdown-item text-danger">{{
            searchResults.error()!.message
          }}</span>
        }
      </div>
    </div>
  `,
  styles: `
    .item-search-dropdown .dropdown-menu {
      max-height: 300px;
      overflow-y: auto;
    }

    .dropdown-item {
      display: flex;
      flex-direction: column;
      width: 100%;
      background: transparent;
    }

    button.dropdown-item {
      cursor: pointer;
    }

    .dropdown-item:focus,
    .dropdown-item.active {
      background-color: var(--bs-primary);
      color: white;
    }

    .item-name {
      font-weight: 500;
      line-height: 1.3;
    }

    .dropdown-item:hover .item-description,
    .dropdown-item.active .item-description {
      opacity: 1;
    }
  `,
})
export class QuerySelectDropdownComponent<T extends IBaseEntity> implements ControlValueAccessor {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (_: unknown) => {
    /* */
  };
  private onTouched = () => {
    /* */
  };

  writeValue(value: Map<string, T>): void {
    this.selectedItems.set(value);
  }
  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(state: boolean): void {
    this.isDisabled.set(state);
  }

  readonly fetcher = input.required<(term: string) => Observable<T[]>>();
  /** Model Map of [ID, item] for selected items. */
  readonly selectedItems = model<Map<string, T>>(new Map<string, T>());
  readonly multiselect = input(false, { transform: booleanAttribute });
  /** The ID to apply to the input. Should match your label for accessibility. */
  readonly inputId = input.required<string>();
  /** The item property key to display in the list. */
  readonly nameProperty = input.required<keyof T>();
  readonly placeholder = input<string>('Search...');
  /** Hide the default display of selected items. */
  readonly hideSelected = input(false, { transform: booleanAttribute });
  /** Class string to apply to selected items. */
  readonly itemClass = input<string>('badge bg-primary');
  /** Amount of time to debounce between inputs. You can safely set this to 0 if using local data. */
  readonly debounceMs = input<number>(300);
  /** Refetch even when input is empty (not recommended when querying remote data) */
  readonly fetchOnEmptyQuery = input(false, { transform: booleanAttribute });

  readonly selectItem = output<T>();
  readonly deselectItem = output<T>();

  private readonly dropdownRef = viewChild.required<NgbDropdown>('drop');
  private readonly dropdownElementRef = viewChild.required<ElementRef<HTMLElement>>('dropEl');
  readonly isDisabled = signal<boolean>(false);
  readonly highlightedItemIndex = signal<number>(-1);
  readonly searchQuery = signal<string>('');

  private readonly query = toObservable(this.searchQuery);

  search: OperatorFunction<string, T[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(this.debounceMs()),
      distinctUntilChanged(),
      switchMap((term) =>
        term.trim().length > 0 || this.fetchOnEmptyQuery() ? this.fetcher()(term) : of([]),
      ),
    );

  searchResults = cachedRxResource({
    stream: () => this.query.pipe(this.search),
  });

  resultCount = computed(() =>
    this.searchResults.error() ? 0 : (this.searchResults.value()?.length ?? 0),
  );

  // Default highlighted index to top result when search query or items change
  defaultHighlightTopResult = effect(() => {
    this.highlightedItemIndex.set(this.resultCount() > 0 ? 0 : -1);
  });

  getOptionId(index: number): string | null {
    if (this.searchResults.error()) {
      return null;
    }
    return 0 <= index && index < this.resultCount()
      ? `${this.inputId()}-option-${this.searchResults.value()![index].id}`
      : null;
  }

  toggleDropdown(state: boolean) {
    if (this.dropdownRef().isOpen() === state) {
      return;
    }
    if (state) {
      this.highlightedItemIndex.set(this.resultCount() > 0 ? 0 : -1);
      this.dropdownRef().open();
    } else {
      this.dropdownRef().close();
      this.searchQuery.set('');
      this.highlightedItemIndex.set(-1);
    }
  }

  addItem(item: T) {
    if (!this.multiselect()) {
      this.selectedItems.update((selected) => {
        selected.clear();
        selected.set(item.id, item);
        return selected;
      });
    } else {
      this.selectedItems.update((selected) => {
        selected.set(item.id, item);
        return selected;
      });
    }
    this.searchQuery.set('');
    this.onChange(this.selectedItems());
    this.onTouched();
    this.selectItem.emit(item);
  }

  addHighlightedOrFirstItem() {
    if (this.dropdownRef().isOpen() === false || this.resultCount() === 0) {
      return;
    }

    const index = this.highlightedItemIndex() < 0 ? 0 : this.highlightedItemIndex();
    this.addItem(this.searchResults.value()![index]);
  }

  removeItem(itemId: string) {
    let removed: T;
    this.selectedItems.update((selected) => {
      if (selected.has(itemId)) {
        removed = selected.get(itemId)!;
        selected.delete(itemId);
      }
      return selected;
    });

    this.onChange(this.selectedItems());
    this.onTouched();
    this.deselectItem.emit(removed!);
  }

  moveSelectionIndex(offset: number) {
    const itemCount = this.resultCount();
    if (itemCount === 0) return;

    if (!this.dropdownRef().isOpen()) {
      this.toggleDropdown(true);
    }
    const newIndex = this.highlightedItemIndex() + offset;
    this.highlightedItemIndex.set((newIndex < 0 ? itemCount - 1 : newIndex) % itemCount);
  }

  handleQueryEdit() {
    // Open the dropdown whenever the *input* changes searchQuery (setting it doesn't trigger this)
    this.toggleDropdown(true);
  }

  handleMoveSelection(event: Event) {
    const e = event as KeyboardEvent;
    e.preventDefault();
    if (!this.dropdownRef().isOpen()) {
      this.toggleDropdown(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      this.moveSelectionIndex(1);
    } else if (e.key === 'ArrowUp') {
      this.moveSelectionIndex(-1);
    }
  }

  handleMouseEnterOption(event: Event, index: number) {
    if (index < 0 || index >= this.resultCount()) {
      return;
    }
    this.highlightedItemIndex.set(index);
  }

  handleSubmit(event: Event) {
    // Don't submit the whole damn form this is in
    event.preventDefault();
    this.addHighlightedOrFirstItem();
  }

  handleEscape(event: Event) {
    event.preventDefault();
    this.toggleDropdown(false);
  }

  // Change focus (tab navigation) -> close dropdown
  handleFocusOut(event: Event) {
    const e = event as FocusEvent;
    const related = e.relatedTarget as Node | null;
    if (related && this.dropdownElementRef().nativeElement.contains(related)) {
      return; // Focus moved to something inside the dropdown - keep open
    }
    this.toggleDropdown(false);
  }
}
