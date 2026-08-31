import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import { AppException } from '../errors/app.exception';
import { ErrorCode } from '../errors/error-codes';

interface ErrorBody {
  statusCode: number;
  code: string;
  message: string;
  timestamp: string;
  path: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const body = this.toErrorBody(exception, request);

    if (body.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        {
          err: exception,
          requestId: request.headers['x-request-id'],
          path: request.url,
        },
        body.message,
      );
    }

    response.status(body.statusCode).json(body);
  }

  private toErrorBody(exception: unknown, request: Request): ErrorBody {
    const timestamp = new Date().toISOString();
    const path = request.url;

    if (exception instanceof AppException) {
      const payload = exception.getResponse() as {
        statusCode: number;
        code: string;
        message: string;
      };
      return { ...payload, timestamp, path };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const raw = exception.getResponse();
      return {
        statusCode: status,
        code: this.codeFromStatus(status, raw),
        message: this.messageFromResponse(raw),
        timestamp,
        path,
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError && exception.code === 'P2002') {
      return {
        statusCode: HttpStatus.CONFLICT,
        code: ErrorCode.CONFLICT,
        message: 'Resource already exists',
        timestamp,
        path,
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError && exception.code === 'P2025') {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        code: ErrorCode.NOT_FOUND,
        message: 'Resource not found',
        timestamp,
        path,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ErrorCode.INTERNAL_ERROR,
      message: 'Internal server error',
      timestamp,
      path,
    };
  }

  private codeFromStatus(status: number, raw: string | object): string {
    if (typeof raw === 'object' && raw !== null && 'code' in raw && typeof raw.code === 'string') {
      return raw.code;
    }

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.VALIDATION_ERROR;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCode.CONFLICT;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return ErrorCode.BUSINESS_RULE;
      case HttpStatus.TOO_MANY_REQUESTS:
        return ErrorCode.TOO_MANY_REQUESTS;
      default:
        return ErrorCode.INTERNAL_ERROR;
    }
  }

  private messageFromResponse(raw: string | object): string {
    if (typeof raw === 'string') {
      return raw;
    }

    if (typeof raw === 'object' && raw !== null && 'message' in raw) {
      const message = raw.message;
      if (Array.isArray(message)) {
        return message.join('; ');
      }
      if (typeof message === 'string') {
        return message;
      }
    }

    return 'Unexpected error';
  }
}
