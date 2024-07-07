import { ConfigModule } from '@nestjs/config';

export default function createConfigModule() {
  return ConfigModule.forRoot({ cache: true, isGlobal: true });
}
