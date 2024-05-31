import { Injectable } from '@nestjs/common';
import GoogleOAuthProvider from '../providers/google-oauth.provider';
import UserQueryService from '../../user/services/user-query.service';
import KakaoOAuthProvider from '../providers/kakao-oauth.provider';
import GithubOAuthProvider from '../providers/github-oauth.provider';
import { DuplicateEmailException } from '../../../common/exceptions/409';
import AuthService from './auth.service';
import UserOAuthQueryService from '../../user/services/user-oauth-query.service';
import { OAuthProviders } from '../../user/domain/entities/user-oauth-provider.entity';

@Injectable()
export default class OAuthService {
  constructor(
    private readonly googleOAuthProvider: GoogleOAuthProvider,
    private readonly kakaoOAuthProvider: KakaoOAuthProvider,
    private readonly githubOAuthProvider: GithubOAuthProvider,
    private readonly userQueryService: UserQueryService,
    private readonly userOAuthProviderQueryService: UserOAuthQueryService,
    private readonly authService: AuthService,
  ) {}

  async googleOAuth(accessToken: string) {
    const userInfo = await this.googleOAuthProvider.authenticate(accessToken);
    return this.handleOAuth(OAuthProviders.GOOGLE, userInfo.email, userInfo.picture);
  }

  async kakaoOAuth(code: string, redirectUri: string) {
    const userInfo = await this.kakaoOAuthProvider.authenticate(code, redirectUri);
    return this.handleOAuth(
      OAuthProviders.KAKAO,
      userInfo.kakao_account.email,
      userInfo.kakao_account.profile.profile_image_url,
    );
  }

  async githubOAuth(code: string, redirectUri: string) {
    const userInfo = await this.githubOAuthProvider.authenticate(code, redirectUri);
    return this.handleOAuth(OAuthProviders.GITHUB, userInfo.email, userInfo.avatar_url);
  }

  private async handleOAuth(provider: OAuthProviders, email: string, profile: string) {
    const userByEmail = await this.userQueryService.findOne({ email });
    const userOAuthProvider = await this.userOAuthProviderQueryService.findOne({ name: provider });

    if (userByEmail && userByEmail.isSignupWithOAuth(userOAuthProvider)) {
      return this.authService.login(userByEmail.id);
    }

    if (userByEmail) {
      throw new DuplicateEmailException();
    }

    return this.authService.register(email, profile, userOAuthProvider);
  }
}
