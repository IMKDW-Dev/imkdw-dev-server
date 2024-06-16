import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
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
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const isHttpException = exception instanceof HttpException;
    const httpStatus = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException
      ? (exception.getResponse() as ExceptionResponse)
      : { message: 'Internal Server Error', error: 'Internal Server Error' };

    const customErrorCode = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message[0]
      : exceptionResponse.message;

    this.logger.error(exception);

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
