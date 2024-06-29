import { CloudWatchLogsClient, PutLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import Transport, { TransportStreamOptions } from 'winston-transport';

interface IOpts extends TransportStreamOptions {
  awsConfig: {
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
    };
    cloudwatch: {
      logGroupName: string;
    };
    region: string;
  };
}

export default class CloudwatchTransport extends Transport {
  private cloudwatchClient: CloudWatchLogsClient;
  private LOGS_GROUP_NAME: string;

  constructor(opts: IOpts) {
    super(opts);

    this.cloudwatchClient = new CloudWatchLogsClient({
      credentials: {
        accessKeyId: opts.awsConfig.credentials.accessKeyId,
        secretAccessKey: opts.awsConfig.credentials.secretAccessKey,
      },
      region: opts.awsConfig.region,
    });
    this.LOGS_GROUP_NAME = opts.awsConfig.cloudwatch.logGroupName;
  }

  // TODO: any 제거하기
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(info: any, next: () => void) {
    this.emit('logged', info);
    const command = new PutLogEventsCommand({
      logGroupName: this.LOGS_GROUP_NAME,
      logStreamName: info.level,
      logEvents: [
        {
          timestamp: Date.now(),
          message: JSON.stringify(info, null, 2),
        },
      ],
    });
    this.cloudwatchClient.send(command);
    next();
  }
}
