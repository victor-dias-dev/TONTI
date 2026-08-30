import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-codes';

export class AppException extends HttpException {
  readonly code: ErrorCode;

  constructor(status: HttpStatus, code: ErrorCode, message: string) {
    super({ statusCode: status, code, message }, status);
    this.code = code;
  }
}
