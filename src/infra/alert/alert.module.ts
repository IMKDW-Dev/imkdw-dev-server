import { Module } from '@nestjs/common';
import { ALERT_SERVICE } from './interfaces/alert.interface';
import SlackAlertService from './services/slack-alert.service';

@Module({
  providers: [
    {
      provide: ALERT_SERVICE,
      useClass: SlackAlertService,
    },
  ],
  exports: [ALERT_SERVICE],
})
export default class AlertModule {}
