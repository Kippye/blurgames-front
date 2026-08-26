import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbCollapse,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgbCollapse,
  ],
  template: `
    <nav
      class="navbar navbar-expand-md navbar-light bg-body-tertiary bg-gradient px-4 mb-3 sticky-top"
    >
      <a class="navbar-brand" routerLink="/">Blurgames</a>
      <button
        class="navbar-toggler"
        type="button"
        (click)="isNavCollapsed.update((v) => !v)"
        data-bs-toggle="collapse"
        data-bs-target="#headerNavbarCollapse"
        aria-controls="headerNavbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        [ngbCollapse]="isNavCollapsed()"
        class="collapse navbar-collapse"
        id="headerNavbarCollapse"
      >
        @if (auth.isLoggedIn()) {
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/projects"
                (click)="isNavCollapsed.set(true)"
                routerLinkActive="active"
                >Projects</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/upload"
                (click)="isNavCollapsed.set(true)"
                routerLinkActive="active"
                >Upload</a
              >
            </li>
          </ul>
        }
        <ul class="navbar-nav ms-auto">
          <!-- TODO: Admin only -->
          @if (auth.isLoggedIn()) {
            <li ngbDropdown class="d-inline-block">
              <button
                id="dropdownAdmin"
                ngbDropdownToggle
                class="nav-link dropdown-toggle"
                type="button"
              >
                Admin
              </button>
              <div ngbDropdownMenu aria-labelledby="dropdownAdmin">
                <a ngbDropdownItem routerLink="/admin/genres" class="dropdown-item"> Genres </a>
                <a ngbDropdownItem routerLink="/admin/project-types" class="dropdown-item">
                  Project Types
                </a>
                <a ngbDropdownItem routerLink="/admin/tags" class="dropdown-item"> Tags </a>
              </div>
            </li>
          }
          @if (auth.isLoggedIn()) {
            <li class="nav-item m-2">
              <span class="navbar-text text-secondary">{{ auth.user()?.userName }}</span>
            </li>
            <li class="nav-item">
              <button
                type="button"
                class="nav-link btn-outline-light btn-sm"
                (click)="auth.logout()"
              >
                Log out
              </button>
            </li>
          } @else {
            <li class="nav-item">
              <a class="nav-link" routerLink="/login">Log in</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/register">Register</a>
            </li>
          }
        </ul>
      </div>
    </nav>
  `,
})
export class NavComponent {
  readonly auth = inject(AuthService);
  // Start with the nav collapsed so that it does not appear initially when the page loads on a small screen
  readonly isNavCollapsed = signal(true);
}
