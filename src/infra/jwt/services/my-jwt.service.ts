import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { IMyJwtService } from '../interfaces/my-jwt.interface';

@Injectable()
export default class MyJwtService implements IMyJwtService {
  private secrentKey: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secrentKey = this.configService.get<string>('JWT_SECRET');
  }

  sign(userId: string, expiresIn: string): string {
    return this.jwtService.sign({ userId }, { expiresIn, secret: this.secrentKey });
  }

  verify(token: string): { userId: string } {
    return this.jwtService.verify(token, { secret: this.secrentKey });
  }
}
