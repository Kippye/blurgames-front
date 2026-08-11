import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './layout/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <app-nav />
      <main class="container flex-grow-1 bg-light p-4 mb-3 rounded">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('blurgames');
}
