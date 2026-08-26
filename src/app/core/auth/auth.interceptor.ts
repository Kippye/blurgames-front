import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

/** These endpoints don't need authorization */
const SKIP = [
  environment.API_REGISTER_ENDPOINT,
  environment.API_LOGIN_ENDPOINT,
  environment.API_REFRESH_ENDPOINT,
];

/** Add authorization header to request */
function withToken<T>(req: HttpRequest<T>, token: string): HttpRequest<T> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  if (SKIP.some((url) => req.url.includes(url))) {
    return next(req);
  }

  const token = auth.token();
  const authed = token ? withToken(req, token) : req;

  // Try sending request with JWT added
  return next(authed).pipe(
    catchError((err: HttpErrorResponse) => {
      // Non-auth related error or not authorized -> throw it
      if (err.status !== 401 || !auth.refreshToken()) {
        return throwError(() => err);
      }
      // 401 -> Refresh and try again
      return auth.refresh().pipe(
        catchError((refreshErr: HttpErrorResponse) => {
          // No valid refresh tokens found -> log out
          if (refreshErr.status === 404) {
            auth.forgetAuth();
          }
          // Throw other errors out to caller
          return throwError(() => refreshErr);
        }),
        // `switchMap` -> switch to a new Observable
        switchMap((res) => next(withToken(req, res.jwt))),
        catchError((retryErr: HttpErrorResponse) => {
          // Still unauthorized after refresh -> log out
          if (retryErr.status === 401 || retryErr.status === 404) {
            auth.forgetAuth();
          }
          // Throw other errors out to caller
          return throwError(() => retryErr);
        }),
      );
    }),
  );
};
