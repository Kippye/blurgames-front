import { TestBed } from '@angular/core/testing';
import { errorInterceptor } from './error.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiClient } from './api-client';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { IApiErrorResponse } from './api-error';

describe('errorInterceptor', () => {
  let httpTesting: HttpTestingController;
  let apiClient: ApiClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    apiClient = TestBed.inject(ApiClient);
  });

  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    TestBed.inject(HttpTestingController).verify();
  });

  it('passes successful responses through', async () => {
    const res$ = apiClient.get<string>(environment.apiUrl);
    const resPromise = firstValueFrom(res$);

    const req = httpTesting.expectOne(
      { method: 'GET', url: environment.apiUrl },
      'GET request to API',
    );

    req.flush('Success');

    expect(await resPromise).toEqual('Success');
  });

  it('handles HTTP 404 as ApiError', async () => {
    const res$ = apiClient.get<string>(environment.apiUrl);
    const resPromise = firstValueFrom(res$);

    const req = httpTesting.expectOne(
      { method: 'GET', url: environment.apiUrl },
      'GET request to API',
    );

    req.flush({ error: 'Not found', status: 404 } satisfies IApiErrorResponse, {
      status: 404,
      statusText: 'Not found',
    });

    await expect(resPromise).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Not found',
      status: 404,
    });
  });

  it('constructs missing error message from status code name', async () => {
    const res$ = apiClient.get<string>(environment.apiUrl);
    const resPromise = firstValueFrom(res$);

    const req = httpTesting.expectOne(
      { method: 'GET', url: environment.apiUrl },
      'GET request to API',
    );

    req.flush(null, {
      status: 404,
      statusText: 'Not found',
    });

    await expect(resPromise).rejects.toMatchObject({
      message: 'Not found.',
      status: 404,
    });
  });

  it('handles HTTP 500 as ApiError with generic message', async () => {
    const res$ = apiClient.get<string>(environment.apiUrl);
    const resPromise = firstValueFrom(res$);

    const req = httpTesting.expectOne(
      { method: 'GET', url: environment.apiUrl },
      'GET request to API',
    );

    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });

    await expect(resPromise).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Server error.',
      status: 500,
    });
  });

  it('handles HTTP 0 as ApiError', async () => {
    const res$ = apiClient.get<string>(environment.apiUrl);
    const resPromise = firstValueFrom(res$);

    const req = httpTesting.expectOne(
      { method: 'GET', url: environment.apiUrl },
      'GET request to API',
    );

    req.error(new ProgressEvent('Network error'));

    await expect(resPromise).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Connection error.',
      status: 0,
    });
  });
});
