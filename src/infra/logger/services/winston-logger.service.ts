import winston from 'winston';
import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Transport from 'winston-transport';

import { ILogger } from '../interfaces/logger.interface';
import CloudwatchTransport from '../transports/cloudwatch.transport';

const { combine, timestamp, prettyPrint, printf, errors } = winston.format;

@Injectable({ scope: Scope.TRANSIENT })
export default class WinstonLogger implements ILogger {
  private logger: winston.Logger;
  private transports: Transport[] = [];

  constructor(private readonly configService: ConfigService) {
    if (process.env.node_env === 'local') {
      this.transports = [new winston.transports.Console({ level: 'debug' })];
    }

    if (process.env.NODE_ENV === 'production') {
      this.transports.push(
        new CloudwatchTransport({
          level: 'debug',
          awsConfig: {
            credentials: {
              accessKeyId: this.configService.get<string>('AWS_IAM_ACCESS_KEY'),
              secretAccessKey: this.configService.get<string>('AWS_IAM_SECRET_ACCESS_KEY'),
            },
            cloudwatch: {
              logGroupName: this.configService.get<string>('CLOUDWATCH_LOG_GROUP_NAME'),
            },
            region: this.configService.get<string>('AWS_REGION'),
          },
        }),
      );
    }

    this.logger = winston.createLogger({
      transports: this.transports,
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss',
        }),
        prettyPrint(),
        printf(({ timestamp: time, level, message, stack }) => {
          let log = `[${time}] ${level}: ${typeof message === 'object' ? JSON.stringify(message, null, 2) : message}`;
          if (stack) {
            log += `\n${stack}`;
          }

          return log;
        }),
        errors({ stack: true }),
      ),
    });
  }

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
