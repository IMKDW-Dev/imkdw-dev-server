import { Controller, Get, Inject } from '@nestjs/common';
import AppService from './app.service';
import { Public } from './modules/auth/decorators/public.decorator';
import { ILogger, LOGGER } from './infra/logger/interfaces/logger.interface';

@Controller()
export default class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER) private readonly logger: ILogger,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    this.logger.debug('asdas');
    return this.appService.getHello();
  }
}
