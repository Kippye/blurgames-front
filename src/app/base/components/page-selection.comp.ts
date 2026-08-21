import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-page-selection',
  imports: [],
  template: `
    <div class="mb-3">
      <span class="me-2"> Page: </span>
      @for (pageNum of pageNumbers(); track pageNum) {
        <button
          class="btn btn-link link-underline-light"
          (click)="changePage.emit(pageNum)"
          [class.text-primary]="currentPage() === pageNum"
          [class.text-dark]="currentPage() !== pageNum"
        >
          {{ pageNum }}
        </button>
      }
    </div>
  `,
  styles: ``,
})
export class BaseFormControlComponent {
  currentPage = input.required<number>();
  pageCount = input.required<number>();
  changePage = output<number>();

  pageNumbers = computed(() => {
    return Array.from({ length: this.pageCount() }, (_, index) => index + 1);
  });
}
