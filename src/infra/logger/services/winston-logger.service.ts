import winston from 'winston';
import { Injectable, Scope } from '@nestjs/common';

import { ILogger } from '../interfaces/logger.interface';

const { combine, timestamp, prettyPrint, printf, errors } = winston.format;

@Injectable({ scope: Scope.TRANSIENT })
export default class WinstonLogger implements ILogger {
  private logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD hh:mm:ss',
      }),
      prettyPrint(),
      printf(({ timestamp: time, level, message, stack }) => {
        let log = `[${time}] ${level}: ${message}`;
        if (stack) {
          log += `\n${stack}`;
        }

        return log;
      }),
      errors({ stack: true }),
    ),
  });

  error(message: unknown): void {
    this.logger.error(message);
  }

  debug(message: unknown): void {
    this.logger.debug(message);
  }

  info(message: unknown): void {
    this.logger.info(message);
  }
}
