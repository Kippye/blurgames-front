import {
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { IBaseEntity } from '../domain.types';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownAnchor } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-select-dropdown',
  imports: [FormsModule, NgbDropdown, NgbDropdownMenu, NgbDropdownAnchor],
  template: `
    @if (!hideSelected()) {
      <div class="selected-items mb-2">
        @for (itemId of selectedItemIds(); track itemId) {
          <span [class]="itemClass() + ' me-1 md-1 d-inline-flex align-items-center'">
            {{ itemsById().get(itemId)![nameProperty()] }}
            <button
              type="button"
              class="btn-close btn-close-white ms-1"
              (click)="removeItem(itemId)"
              [aria-label]="'Remove' + itemsById().get(itemId)![nameProperty()]"
            ></button>
          </span>
        }
        @if (selectedItemIds().length === 0) {
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
          [(ngModel)]="searchQuery"
          [placeholder]="placeholder()"
          (ngModelChange)="handleQueryEdit()"
          (keydown.arrowdown)="handleMoveSelection($event)"
          (keydown.arrowup)="handleMoveSelection($event)"
          (keydown.enter)="handleSubmit($event)"
          (keydown.escape)="handleEscape($event)"
          [aria-expanded]="dropdownRef().isOpen()"
          [aria-controls]="inputId() + '-menu'"
          [attr.aria-activedescendant]="getOptionId(highlightedItemIndex())"
        />
      </div>
      <div [id]="inputId() + '-menu'" ngbDropdownMenu role="listbox" class="dropdown-menu w-100">
        @if (searchResultItems().length > 0) {
          @for (item of searchResultItems(); track item.id) {
            <button
              [id]="getOptionId($index)"
              tabindex="-1"
              type="button"
              role="option"
              ngbDropdownItem
              class="dropdown-item no-decoration"
              [class.active]="$index === highlightedItemIndex()"
              (click)="addItem(item.id)"
              (mouseenter)="handleMouseEnterOption($event, $index)"
              [aria-selected]="$index === highlightedItemIndex()"
            >
              <div class="item-name">{{ item[nameProperty()] }}</div>
            </button>
          }
        } @else {
          <span ngbDropdownItem class="dropdown-item text-muted">No results found</span>
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
export class SearchSelectDropdownComponent<T extends IBaseEntity> {
  /** Model array of selected item IDs. */
  readonly selectedItemIds = model.required<string[]>();
  /** The ID to apply to the input. Should match your label for accessibility. */
  readonly inputId = input.required<string>();
  /** Readonly list of available items. */
  readonly items = input<T[]>([]);
  /** The item property key to display in the list. */
  readonly nameProperty = input.required<keyof T>();
  readonly placeholder = input<string>('Search...');
  /** Hide the default display of selected items. */
  readonly hideSelected = input(false, { transform: booleanAttribute });
  /** Class string to apply to selected items. */
  readonly itemClass = input<string>('badge bg-primary');
  /** Maximum number of items to list. */
  readonly displayLimit = input<number>(5);

  readonly dropdownRef = viewChild.required<NgbDropdown>('drop');
  private readonly dropdownElementRef = viewChild.required<ElementRef<HTMLElement>>('dropEl');
  readonly searchQuery = signal<string>('');
  readonly highlightedItemIndex = signal<number>(-1);

  readonly itemsById = computed((): Map<string, T> => {
    return new Map<string, T>(this.items().map((item) => [item.id, item]));
  });

  readonly availableItems = computed(() => {
    return this.items().filter((item) => !this.selectedItemIds().includes(item.id));
  });

  readonly searchResultItems = computed(() => {
    if (!this.searchQuery()) {
      return this.availableItems().slice(0, this.displayLimit());
    }
    return this.availableItems()
      .filter((item) =>
        (item[this.nameProperty()] as string)
          .toLowerCase()
          .includes(this.searchQuery().toLowerCase()),
      )
      .slice(0, this.displayLimit());
  });

  // Default highlighted index to top result when search query or items change
  defaultHighlightTopResult = effect(() => {
    this.highlightedItemIndex.set(this.searchResultItems().length > 0 ? 0 : -1);
  });

  getOptionId(index: number): string | null {
    return 0 <= index && index < this.searchResultItems().length
      ? `${this.inputId()}-option-${this.searchResultItems()[index].id}`
      : null;
  }

  toggleDropdown(state: boolean) {
    if (this.dropdownRef().isOpen() === state) {
      return;
    }
    if (state) {
      this.highlightedItemIndex.set(this.searchResultItems().length > 0 ? 0 : -1);
      this.dropdownRef().open();
    } else {
      this.dropdownRef().close();
      this.highlightedItemIndex.set(-1);
    }
  }

  addItem(itemId: string) {
    this.selectedItemIds.update((items) => {
      return [...items, itemId];
    });
    this.searchQuery.set('');
  }

  addHighlightedOrFirstItem() {
    if (this.dropdownRef().isOpen() === false || this.searchResultItems().length === 0) {
      return;
    }

    const index = this.highlightedItemIndex() < 0 ? 0 : this.highlightedItemIndex();
    this.addItem(this.searchResultItems()[index]!.id);
  }

  removeItem(itemId: string) {
    this.selectedItemIds.set(this.selectedItemIds().filter((id) => id !== itemId));
  }

  moveSelectionIndex(offset: number) {
    const itemCount = this.searchResultItems().length;
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
    if (index < 0 || index >= this.searchResultItems().length) {
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
