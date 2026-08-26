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
    path: 'projects',
    redirectTo: 'projects/1',
  },
  {
    path: 'projects/:page',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/projects/projects.comp').then((m) => m.ProjectsComponent),
  },
  {
    path: 'upload',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/upload/upload-project.comp').then((m) => m.UploadProjectComponent),
  },
  {
    path: 'admin/author-roles',
    redirectTo: 'admin/author-roles/1',
  },
  {
    path: 'admin/genres',
    redirectTo: 'admin/genres/1',
  },
  {
    path: 'admin/genres/:page',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin.genres.comp').then((m) => m.AdminGenresComponent),
  },
  {
    path: 'admin/project-types',
    redirectTo: 'admin/project-types/1',
  },
  {
    path: 'admin/project-types/:page',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin.project-types.comp').then((m) => m.AdminProjectTypesComponent),
  },
  {
    path: 'admin/tags',
    redirectTo: 'admin/tags/1',
  },
  {
    path: 'admin/tags/:page',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin.tags.comp').then((m) => m.AdminTagsComponent),
  },
  { path: '**', redirectTo: '' },
];
