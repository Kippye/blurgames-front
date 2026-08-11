import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { Home } from './home/home';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: Home,
  },
  {
    path: 'login',
    loadComponent: () => import('./features/account/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/account/register.component').then((m) => m.RegisterComponent),
  },
  { path: '**', redirectTo: '' },
];
