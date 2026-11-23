export type ValidationIssue = {
  path: Array<string | number>;
  message: string;
};

export class HttpError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details: ValidationIssue[] | undefined;

  constructor(statusCode: number, code: string, message: string, details?: ValidationIssue[]) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
