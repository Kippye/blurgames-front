import type { IHttpErrorResponse } from '@/types/IHttpErrorResponse';

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly responseMessage: string | null;

  constructor(statusCode: number, message: string, responseMessage: string | null = null) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.responseMessage = responseMessage;
  }

  static async fromResponse(response: Response): Promise<HttpError> {
    let responseMessage: string | null = null;

    try {
      const errorBody = (await response.json()) as IHttpErrorResponse;
      responseMessage = errorBody.message || null;
    } catch {
      // If parsing fails, we'll use the default message
    }

    const defaultMessage = `HTTP ${response.status}: ${response.statusText}`;
    return new HttpError(response.status, defaultMessage, responseMessage);
  }

  getUserMessage(): string {
    return this.responseMessage || this.message;
  }
}
