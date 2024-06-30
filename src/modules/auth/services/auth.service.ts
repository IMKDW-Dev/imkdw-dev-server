import { Injectable } from '@nestjs/common';
import UserService from '../../user/services/user.service';
import UserOAuthProvider from '../../user/domain/models/user-oauth-provider.model';
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
    return this.login(registerdUser.getId());
  }

  refreshToken(cookies: string): string {
    return this.tokenService.refresh(cookies);
  }
}
