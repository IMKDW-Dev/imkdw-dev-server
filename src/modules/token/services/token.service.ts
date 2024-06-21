import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export default class TokenService {
  private ACCESS_TOKEN_EXPIRES_IN: string;
  private REFRESH_TOKEN_EXPIRES_IN: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.ACCESS_TOKEN_EXPIRES_IN = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN');
    this.REFRESH_TOKEN_EXPIRES_IN = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN');
  }

  generateAccessToken(userId: string) {
    return this.jwtService.sign({ userId }, { expiresIn: this.ACCESS_TOKEN_EXPIRES_IN });
  }

  generateRefreshToken(userId: string) {
    return this.jwtService.sign({ userId }, { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN });
  }

  verify(token: string): string {
    return this.jwtService.verify(token).userId;
  }
}
