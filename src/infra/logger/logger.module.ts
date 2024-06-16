import { Global, Module } from '@nestjs/common';
import { LOGGER } from './interfaces/logger.interface';
import WinstonLogger from './services/winston-logger.service';

@Global()
@Module({
  providers: [
    {
      provide: LOGGER,
      useClass: WinstonLogger,
    },
  ],
  exports: [LOGGER],
})
export default class LoggerModule {}
