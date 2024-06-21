import { Inject, Injectable } from '@nestjs/common';
import UserService from '../../user/services/user.service';
import UserOAuthProvider from '../../user/domain/entities/user-oauth-provider.entity';
import { parseRefreshTokenByCookie } from '../../functions/cookie.function';
import { InvalidRefreshTokenException, RefreshTokenExpiredException } from '../../../common/exceptions/401';
import TokenService from '../../token/services/token.service';

@Injectable()
export default class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  login(userId: string) {
    const accessToken = this.tokenService.generateAccessToken(userId);
    const refreshToken = this.tokenService.generateRefreshToken(userId);

    return { accessToken, refreshToken, userId };
  }

  async register(email: string, oAuthProvider: UserOAuthProvider) {
    const registerdUser = await this.userService.createUser(email, oAuthProvider);
    return this.login(registerdUser.id);
  }

  refreshToken(cookies: string) {
    const refreshToken = parseRefreshTokenByCookie(cookies);
    if (!refreshToken) {
      throw new InvalidRefreshTokenException(cookies);
    }

    try {
      const userId = this.tokenService.verify(refreshToken);
      return this.tokenService.generateAccessToken(userId);
    } catch {
      throw new RefreshTokenExpiredException(cookies);
    }
  }
}
