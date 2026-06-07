import type { IAuthInfo } from './IAuthInfo';

export interface IAuthStore {
  getAuthInfo(): IAuthInfo | null;
  refresh(): Promise<void>;
  isLoggedIn(): boolean;
}
