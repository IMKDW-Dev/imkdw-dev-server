import { HttpStatus, Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { IAlertService, IErrorParams } from '../interfaces/alert.interface';

@Injectable()
export default class SlackAlertService implements IAlertService {
  private slackClient: WebClient;

  constructor(private readonly configService: ConfigService) {
    this.slackClient = new WebClient(this.configService.get<string>('SLACK_BOT_TOKEN'));
  }

  error(params: IErrorParams): void {
    this.slackClient.chat.postMessage({
      channel: this.configService.get<string>('SLACK_CHANNEL_ERROR'),
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '💥 에러가 발생했습니다',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*에러 메세지:* ${params.error.message}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*요청 URL:* [${params.method}] ${params.url}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*발생시간:* ${format(new Date(), 'yyyy-MM-dd HH:mm:ss', { locale: ko })}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*에러 코드:* ${params.error?.message || HttpStatus.INTERNAL_SERVER_ERROR}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*에러 스택:* ${params.error.stack.slice(0, 500)}`,
          },
        },
      ],
      text: '💥 에러가 발생했습니다',
    });
  }
}
