import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InvalidJwtTokenException, RefreshTokenExpiredException } from '../../../common/exceptions/401';

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
    try {
      return this.jwtService.verify(token).userId;
    } catch (err) {
      throw new InvalidJwtTokenException(token);
    }
  }

  refresh(cookie: string) {
    const { refreshToken } = this.parseJwtTokenByCookie(cookie);
    if (!refreshToken) {
      throw new InvalidJwtTokenException(cookie);
    }

    try {
      const userId = this.verify(refreshToken);
      return this.generateAccessToken(userId);
    } catch {
      throw new RefreshTokenExpiredException(cookie);
    }
  }

  parseJwtTokenByCookie(cookie: string) {
    const tokenCookies: { [key: string]: string } = {};

    cookie.split(';').forEach((_cookie: string) => {
      const trimCookie = _cookie.trim();
      const mid = trimCookie.indexOf('=');
      const [key, value] = [trimCookie.slice(0, mid), trimCookie.slice(mid + 1)];
      tokenCookies[key] = value;
    });

    const accessToken = tokenCookies?.accessToken || '';
    const refreshToken = tokenCookies?.refreshToken || '';

    return { accessToken, refreshToken };
  }
}
