import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // If not logged in -> login screen
  if (!(auth.user()?.roles ?? []).some((role) => role === 'Admin')) {
    // No "forbidden" page so just redirect to home
    return router.createUrlTree(['/']);
  }
  return true;
};
