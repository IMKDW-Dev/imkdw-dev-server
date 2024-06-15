import { Inject, Injectable } from '@nestjs/common';
import { IMyJwtService, MY_JWT_SERVICE } from '../../../infra/secure/jwt/interfaces/my-jwt.interface';
import UserService from '../../user/services/user.service';
import UserOAuthProvider from '../../user/domain/entities/user-oauth-provider.entity';
import { parseRefreshTokenByCookie } from '../../functions/cookie.function';
import { InvalidRefreshTokenException, RefreshTokenExpiredException } from '../../../common/exceptions/401';

@Injectable()
export default class AuthService {
  constructor(
    @Inject(MY_JWT_SERVICE) private readonly jwtService: IMyJwtService,
    private readonly userService: UserService,
  ) {}

  login(userId: string) {
    const accessToken = this.jwtService.generateToken('access', userId);
    const refreshToken = this.jwtService.generateToken('refresh', userId);

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
      const userId = this.jwtService.verify(refreshToken);
      return this.jwtService.generateToken('access', userId);
    } catch {
      throw new RefreshTokenExpiredException(cookies);
    }
  }
}
