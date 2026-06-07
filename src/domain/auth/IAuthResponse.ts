export interface IAuthResponse {
  jwt: string;
  refreshToken: string;
  userName: string;
  email: string;
  roles: string[];
  appUserId: string;
}
