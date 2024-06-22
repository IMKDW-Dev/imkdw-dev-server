import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvalidJwtTokenException, RefreshTokenExpiredException } from '../../../common/exceptions/401';
import { IMyJwtService, MY_JWT_SERVICE } from '../../../infra/jwt/interfaces/my-jwt.interface';

@Injectable()
export default class TokenService {
  private ACCESS_TOKEN_EXPIRES_IN: string;
  private REFRESH_TOKEN_EXPIRES_IN: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(MY_JWT_SERVICE) private readonly jwtService: IMyJwtService,
  ) {
    this.ACCESS_TOKEN_EXPIRES_IN = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN');
    this.REFRESH_TOKEN_EXPIRES_IN = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN');
  }

  generateAccessToken(userId: string) {
    return this.jwtService.sign(userId, this.ACCESS_TOKEN_EXPIRES_IN);
  }

  generateRefreshToken(userId: string) {
    return this.jwtService.sign(userId, this.REFRESH_TOKEN_EXPIRES_IN);
  }

  verify(token: string): string {
    try {
      return this.jwtService.verify(token).userId;
    } catch {
      throw new InvalidJwtTokenException(token);
    }
  }

  refresh(cookie: string) {
    const { refreshToken } = this.parseJwtTokenByCookie(cookie);
    if (!refreshToken) {
      throw new InvalidJwtTokenException(cookie);
    }

    try {
      const decodedToken = this.jwtService.verify(refreshToken);
      return this.generateAccessToken(decodedToken.userId);
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
