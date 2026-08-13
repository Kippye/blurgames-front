export interface IApiErrorResponse {
  status: number;
  error: string;
}

export default class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    // public readonly errors: string[] = [],
  ) {
    super(message);

    this.name = 'ApiError';
  }
}
