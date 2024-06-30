import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { IS_LOCAL } from '../constants/env.constant';
import { ILogger, LOGGER } from '../../infra/logger/interfaces/logger.interface';
import { ALERT_SERVICE, IAlertService } from '../../infra/alert/interfaces/alert.interface';
import { isProduction } from '../functions/enviroment.function';

interface ExceptionResponse {
  message: string[] | string;
  error: string;
}

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(LOGGER) private readonly logger: ILogger,
    @Inject(ALERT_SERVICE) private readonly alertService: IAlertService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
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

    this.logger.error({
      timestamp: new Date().toISOString(),
      requester: request.ip,
      method,
      url: originalUrl,
      ip: request.ip,
      userAgent: request.get('User-Agent'),
      status: httpStatus,
      processingTime: '0ms',
      request: {
        body,
        query: request.query,
        params: request.params,
      },
      response: {
        body: exceptionResponse,
      },
      errorCode: customErrorCode,
      stack: exception instanceof Error ? exception.stack : '',
    });

    if (isProduction() && httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.alertService.error({
        error: exception instanceof Error ? exception : new Error(customErrorCode),
        method,
        url: originalUrl,
      });
    }

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
