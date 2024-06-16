import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ILogger, LOGGER } from '../../infra/logger/interfaces/logger.interface';

@Injectable()
export default class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(LOGGER) private readonly logger: ILogger) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;

    response.on('finish', () => {
      const { statusCode } = response;
      this.logger.info(`${method} - ${originalUrl} ${statusCode}`);
    });

    next();
  }
}
