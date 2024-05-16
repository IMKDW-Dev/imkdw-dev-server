import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { IMyJwtService, JwtTokenType } from '../interfaces/my-jwt.interface';

@Injectable()
export default class MyJwtService implements IMyJwtService {
  private ACCESS_TOKEN_EXPIRES_IN: string;
  private REFRESH_TOKEN_EXPIRES_IN: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.ACCESS_TOKEN_EXPIRES_IN = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN');
    this.REFRESH_TOKEN_EXPIRES_IN = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN');
  }

  generateToken(tokenType: JwtTokenType, userId: string): string {
    const expiresIn = tokenType === 'access' ? this.ACCESS_TOKEN_EXPIRES_IN : this.REFRESH_TOKEN_EXPIRES_IN;
    return this.jwtService.sign({ userId }, { expiresIn });
  }
}
