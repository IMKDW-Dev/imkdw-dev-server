import { ConfigService } from '@nestjs/config';

export default class FakeConfigService extends ConfigService {
  get(key: string): string {
    return key;
  }
}
