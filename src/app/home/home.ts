import { Component, inject, signal } from '@angular/core';
import {
  NgbAlert,
  NgbPopover,
  NgbProgressbar,
  NgbTooltip,
  NgbRating,
  NgbRatingConfig,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  imports: [NgbAlert, NgbPopover, NgbProgressbar, NgbTooltip, NgbRating],
  template: `
    <h1 class="page-title">Blurgames</h1>
    <div class="page-content">
      <p>
        <strong>Welcome!</strong><br />Login or create an account to browse projects and upload your
        own! 😮
      </p>
      <p>I shall add a lot of extra content on this page to see if the layout works properly!</p>
      <ngb-alert type="info">Just playing around with some Ngb components here!</ngb-alert>
      <div class="mb-3">
        <p>Simple tooltip</p>
        <button
          type="button"
          class="btn btn-outline-secondary me-2"
          ngbTooltip="You see, I show up after 300ms and disappear after 500ms!"
          [openDelay]="300"
          [closeDelay]="500"
        >
          Hover 300ms here
        </button>
      </div>
      <div class="mb-3">
        <p>Popover (ideally wouldn't close while content is hovered)</p>
        <ng-template #popContent
          >A genre with lots of shooting and explosions <br />
          <em
            >(i think these would be good for <code>genre</code> /
            <code>tag</code> descriptions)</em
          >
        </ng-template>
        <button
          type="button"
          class="btn btn-outline-secondary"
          [ngbPopover]="popContent"
          triggers="mouseenter:mouseleave"
          popoverTitle="Action"
        >
          This is a hover popover :o!
        </button>
      </div>
      <div class="mb-3">
        <p>Progress bar</p>
        <ngb-progressbar
          class=" w-25"
          type="success"
          [value]="50"
          [striped]="true"
          [animated]="true"
          >50%</ngb-progressbar
        >
      </div>
      <div class="mb-3">
        <p>Ratings (with bootstrap icons for stars)</p>
        <ngb-rating [(rate)]="rating">
          <ng-template let-fill="fill" let-index="index">
            <i class="text-warning bi-star{{ fill === 100 ? '-fill' : '' }}"></i>
          </ng-template>
        </ngb-rating>
      </div>
    </div>
  `,
  styles: ``,
})
export class Home {
  readonly rating = signal(3);
  constructor() {
    const config = inject(NgbRatingConfig);
    config.max = 5;
  }
}
