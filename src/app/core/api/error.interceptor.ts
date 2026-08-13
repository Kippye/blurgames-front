import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import ApiError, { IApiErrorResponse } from './api-error';
import { toSeparateWords } from '../../util/string-helpers';

function isApiErrorResponse(value: unknown): value is IApiErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    'status' in value &&
    typeof value.error === 'string' &&
    typeof value.status === 'number'
  );
}

/** Create a basic error message from any HTTP status code.
 *
 * 404 -> 'Not found.'
 *
 * 999 -> 'Unexpected error.'
 */
function getStatusCodeErrorMessage(status: number): string {
  const codeName = HttpStatusCode[status];
  if (codeName == null) {
    return 'Unexpected error';
  }

  const message = toSeparateWords(codeName); // Not Found
  return message.charAt(0).toUpperCase() + message.toLowerCase().slice(1) + '.'; // Not found.
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Network error
      if (err.status === 0) {
        return throwError(() => new ApiError('Connection error.', 0));
      }
      // Server error displays generic error message
      if (err.status >= 500) {
        return throwError(() => new ApiError('Server error.', err.status));
      }
      const error = err.error;
      if (isApiErrorResponse(error)) {
        // Try to parse error as IApiErrorResponse
        return throwError(() => new ApiError(error.error, error.status));
      } else {
        // Otherwise just use error as string
        return throwError(() => new ApiError(getStatusCodeErrorMessage(err.status), err.status));
      }
    }),
  );
};
