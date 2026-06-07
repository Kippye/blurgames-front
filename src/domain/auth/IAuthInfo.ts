export interface IAuthInfo {
  jwt: string;
  refreshToken: string;
  userName: string;
  email: string;
  systemRoles: string[];
}
