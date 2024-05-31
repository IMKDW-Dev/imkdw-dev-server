import { Inject, Injectable } from '@nestjs/common';
import { IMyJwtService, MY_JWT_SERVICE } from '../../../infra/secure/jwt/interfaces/my-jwt.interface';
import UserService from '../../user/services/user.service';
import UserOAuthProvider from '../../user/domain/entities/user-oauth-provider.entity';

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

  async register(email: string, profile: string, oAuthProvider: UserOAuthProvider) {
    const registerdUser = await this.userService.createUser(email, profile, oAuthProvider);
    return this.login(registerdUser.id);
  }
}
