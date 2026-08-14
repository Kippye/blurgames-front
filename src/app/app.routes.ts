import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/auth.guard.admin';
import { Home } from './home/home.comp';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: Home,
  },
  {
    path: 'login',
    loadComponent: () => import('./features/account/login.comp').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/account/register.comp').then((m) => m.RegisterComponent),
  },
  {
    path: 'admin/author-roles',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin.author-roles.comp').then((m) => m.AdminAuthorRolesComponent),
  },
  {
    path: 'admin/genres',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin.genres.comp').then((m) => m.AdminGenresComponent),
  },
  {
    path: 'admin/project-types',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin.project-types.comp').then((m) => m.AdminProjectTypesComponent),
  },
  {
    path: 'admin/tags',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin.tags.comp').then((m) => m.AdminTagsComponent),
  },
  { path: '**', redirectTo: '' },
];
