export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

export const isUnauthorized = (err: unknown) => isApiError(err) && err.status === 401;
export const isNotFound = (err: unknown) => isApiError(err) && err.status === 404;
export const isConflict = (err: unknown) => isApiError(err) && err.status === 409;
export const isValidation = (err: unknown) => isApiError(err) && err.status === 400;