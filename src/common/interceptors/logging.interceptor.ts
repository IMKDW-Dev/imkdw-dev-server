import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

import { ILogger, LOGGER } from '../../infra/logger/interfaces/logger.interface';
import { generateUUID } from '../utils/uuid';

@Injectable()
export default class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(LOGGER) private readonly logger: ILogger) {}

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    return next.handle().pipe(
      tap((responseBody) => {
        const endTime = Date.now();

        this.logger.info({
          timestamp: new Date().toISOString(),
          requester: request.user?.userId ?? `anonymous-${generateUUID()}`,
          method: request.method,
          url: request.url,
          ip: request.headers['x-forwarded-for'] || request.ip,
          userAgent: request.headers['user-agent'],
          status: response.statusCode,
          processingTime: `${endTime - startTime}ms`,
          request: {
            body: request.body,
            query: request.query,
            params: request.params,
          },
          response: {
            body: responseBody,
          },
        });
      }),
    );
  }
}
