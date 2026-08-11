export interface JwtResponse {
  jwt: string;
  refreshToken: string;
  userName: string;
  email: string;
  roles: string[];
  userId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface RefreshRequest {
  jwt: string;
  refreshToken: string;
}
