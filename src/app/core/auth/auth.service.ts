import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JwtResponse, LoginRequest, RefreshRequest, RegisterRequest } from './jwt-response.model';
import { finalize, Observable, shareReplay, tap } from 'rxjs';

const TOKEN_KEY = 'token';
const REFRESH_KEY = 'refreshToken';
const USER_KEY = 'user';

interface IUser {
  userName: string;
  email: string;
  roles: string[];
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // in-memory user data
  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly refreshToken = signal<string | null>(localStorage.getItem(REFRESH_KEY));
  readonly user = signal<IUser | null>(this.readUser());

  readonly isLoggedIn = computed<boolean>(() => this.token() != null);

  private refreshTracker: Observable<JwtResponse> | null = null;

  login(body: LoginRequest): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${environment.apiUrl}${environment.API_LOGIN_ENDPOINT}`, body)
      .pipe(tap((res) => this.persist(res)));
  }

  register(body: RegisterRequest): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${environment.apiUrl}${environment.API_REGISTER_ENDPOINT}`, body)
      .pipe(tap((res) => this.persist(res)));
  }

  refresh(): Observable<JwtResponse> {
    if (this.refreshTracker) return this.refreshTracker;

    const body: RefreshRequest = {
      jwt: this.token()!,
      refreshToken: this.refreshToken()!,
    };

    this.refreshTracker = this.http
      .post<JwtResponse>(`${environment.apiUrl}${environment.API_REFRESH_ENDPOINT}`, body)
      .pipe(
        tap((res) => this.persist(res)), // on success: persist result
        finalize(() => (this.refreshTracker = null)), // on failure: set tracker to null
        shareReplay({ bufferSize: 1, refCount: true }), // avoid multiple refreshes in parallel
      );

    return this.refreshTracker;
  }

  /** Notify API of logout and clear auth info. */
  logout(): void {
    this.http.get(`${environment.apiUrl}${environment.API_LOGOUT_ENDPOINT}`);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.refreshToken.set(null);
    this.user.set(null);
    this.router.navigateByUrl('/login');
  }

  private persist(res: JwtResponse) {
    localStorage.setItem(TOKEN_KEY, res.jwt);
    localStorage.setItem(REFRESH_KEY, res.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res as IUser));

    this.token.set(res.jwt);
    this.refreshToken.set(res.refreshToken);
    this.user.set(res as IUser);
  }

  private readUser(): IUser | null {
    const user_json = localStorage.getItem(USER_KEY);
    return user_json ? JSON.parse(user_json) : null;
  }
}
