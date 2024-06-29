import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { IS_LOCAL } from '../constants/env.constant';
import { ILogger, LOGGER } from '../../infra/logger/interfaces/logger.interface';

interface ExceptionResponse {
  message: string[] | string;
  error: string;
}

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(LOGGER) private readonly logger: ILogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    if (process.env.NODE_ENV === 'local') {
      // eslint-disable-next-line no-console
      console.error(exception);
    }

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const isHttpException = exception instanceof HttpException;
    const httpStatus = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException
      ? (exception.getResponse() as ExceptionResponse)
      : { message: 'Internal Server Error', error: 'Internal Server Error' };

    const customErrorCode = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message[0]
      : exceptionResponse.message;

    const { method, originalUrl, body } = request;
    this.logger.error(
      `
      [${method}] ${originalUrl}
      user: ${request?.user ? JSON.stringify(request.user) : 'anonymous'}
      body: ${JSON.stringify(body)}
      error: ${JSON.stringify(exceptionResponse)}
    `.replace('/t', ''),
    );

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      method: ctx.getRequest().method,
      errorCode: customErrorCode,
      ...(IS_LOCAL && { description: exceptionResponse }),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
