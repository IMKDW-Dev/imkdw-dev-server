import { TestBed } from '@automock/jest';
import OAuthService from '../../services/oauth.service';
import UserService from '../../../user/services/user.service';
import { HTTP_REST_SERVICE, IHttpRestService } from '../../../../infra/http/rest/interfaces/http-rest.interface';
import { createUser } from '../../../../__test__/fixtures/user/create-user.test-fixture';
import UserOAuthProvider from '../../../user/domain/models/user-oauth-provider.model';
import AuthService from '../../services/auth.service';
import { generateUUID } from '../../../../common/utils/uuid';
import { DuplicateEmailException } from '../../../../common/exceptions/409';
import { createGoogleOAuthUserInfo } from '../fixtures/google-oauth.fixture';
import { createKakaoOAuthToken, createKakaoUserInfo } from '../fixtures/kakao-oauth.fixture';
import { createGithubOAuthToken, createGithubUserInfo } from '../fixtures/github-oauth.fixture';

describe('OAuthService', () => {
  let sut: OAuthService;
  let authService: AuthService;
  let userService: UserService;
  let httpService: IHttpRestService;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(OAuthService).compile();
    sut = unit;
    authService = unitRef.get(AuthService);
    userService = unitRef.get(UserService);
    httpService = unitRef.get(HTTP_REST_SERVICE);
  });

  describe('구글 소셜로그인', () => {
    it('이미 구글로 회원가입된 유저인 경우 로그인을 시도한다', async () => {
      // Given
      const [accessToken, userId, email] = ['dummy_accessToken', generateUUID(), 'dummy_email'];

      const googleOAuthUserInfo = createGoogleOAuthUserInfo({ id: userId, email });
      jest.spyOn(httpService, 'get').mockResolvedValueOnce(googleOAuthUserInfo);

      const user = createUser({ id: userId, provider: UserOAuthProvider.GOOGLE });
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);

      // When
      await sut.googleOAuth(accessToken);

      // Then
      expect(authService.login).toHaveBeenCalledWith(userId);
    });

    it('구글로 회원가입을 시도했으나 이미 다른 소셜로그인으로 가입된 경우 DuplicateEmailException 에러를 반환한다', async () => {
      // Given
      const [accessToken, userId, email] = ['dummy_accessToken', generateUUID(), 'dummy_email'];

      const googleOAuthUserInfo = createGoogleOAuthUserInfo({ id: userId, email });
      jest.spyOn(httpService, 'get').mockResolvedValueOnce(googleOAuthUserInfo);

      const user = createUser({ id: userId, provider: UserOAuthProvider.GITHUB });
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);

      // When, Then
      await expect(sut.googleOAuth(accessToken)).rejects.toThrow(DuplicateEmailException);
    });

    it('회원가입이 되어있지 않은 경우 구글로 회원가입을 시도한다', async () => {
      // Given
      const [accessToken, userId, email] = ['dummy_accessToken', generateUUID(), 'dummy_email'];

      const googleOAuthUserInfo = createGoogleOAuthUserInfo({ id: userId, email });
      jest.spyOn(httpService, 'get').mockResolvedValueOnce(googleOAuthUserInfo);

      // When
      await sut.googleOAuth(accessToken);

      // Then
      expect(authService.register).toHaveBeenCalledWith(email, UserOAuthProvider.GOOGLE);
    });
  });

  describe('카카오 소셜로그인', () => {
    it('이미 카카오로 회원가입된 유저인 경우 로그인을 시도한다', async () => {
      // Given
      const [userId, email] = [generateUUID(), 'dummy_email'];

      const kakaoOAuthToken = createKakaoOAuthToken();
      jest.spyOn(httpService, 'post').mockResolvedValueOnce(kakaoOAuthToken);

      const kakaoUserInfo = createKakaoUserInfo(email);
      jest.spyOn(httpService, 'get').mockResolvedValueOnce(kakaoUserInfo);

      const user = createUser({ id: userId, provider: UserOAuthProvider.KAKAO });
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);

      // When
      await sut.kakaoOAuth('dummy_code', 'dummy_redirectUri');

      // Then
      expect(authService.login).toHaveBeenCalledWith(userId);
    });

    it('카카오로 회원가입을 시도했으나 이미 다른 소셜로그인으로 가입된 경우 DuplicateEmailException 에러를 반환한다', async () => {
      // Given
      const [userId, email] = [generateUUID(), 'dummy_email'];

      const kakaoOAuthToken = createKakaoOAuthToken();
      jest.spyOn(httpService, 'post').mockResolvedValueOnce(kakaoOAuthToken);

      const kakaoUserInfo = createKakaoUserInfo(email);
      jest.spyOn(httpService, 'get').mockResolvedValueOnce(kakaoUserInfo);

      const user = createUser({ id: userId, provider: UserOAuthProvider.GITHUB });
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);

      // When, Then
      await expect(sut.kakaoOAuth('dummy_code', 'dummy_redirectUri')).rejects.toThrow(DuplicateEmailException);
    });

    it('회원가입이 되어있지 않은 경우 카카오로 회원가입을 시도한다', async () => {
      // Given
      const email = generateUUID();

      const kakaoOAuthToken = createKakaoOAuthToken();
      jest.spyOn(httpService, 'post').mockResolvedValueOnce(kakaoOAuthToken);

      const kakaoUserInfo = createKakaoUserInfo(email);
      jest.spyOn(httpService, 'get').mockResolvedValueOnce(kakaoUserInfo);

      // When
      await sut.kakaoOAuth('dummy_code', 'dummy_redirectUri');

      // Then
      expect(authService.register).toHaveBeenCalledWith(email, UserOAuthProvider.KAKAO);
    });
  });

  describe('깃허브 소셜로그인', () => {
    it('이미 깃허브로 회원가입된 유저인 경우 로그인을 시도한다', async () => {
      // Given
      const [userId, email] = [generateUUID(), 'dummy_email'];

      const githubOAuthToken = createGithubOAuthToken();
      jest.spyOn(httpService, 'post').mockResolvedValueOnce(githubOAuthToken);

      const githubUserInfo = createGithubUserInfo(email);
      jest.spyOn(httpService, 'get').mockResolvedValueOnce(githubUserInfo);

      const user = createUser({ id: userId, provider: UserOAuthProvider.GITHUB });
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);

      // When
      await sut.githubOAuth('dummy_code', 'dummy_redirectUri');

      // Then
      expect(authService.login).toHaveBeenCalledWith(userId);
    });

    it('깃허브로 회원가입을 시도했으나 이미 다른 소셜로그인으로 가입된 경우 DuplicateEmailException 에러를 반환한다', async () => {
      // Given
      const [userId, email] = [generateUUID(), 'dummy_email'];

      const githubOAuthToken = createGithubOAuthToken();
      jest.spyOn(httpService, 'post').mockResolvedValueOnce(githubOAuthToken);

      const githubUserInfo = createGithubUserInfo(email);
      jest.spyOn(httpService, 'get').mockResolvedValueOnce(githubUserInfo);

      const user = createUser({ id: userId, provider: UserOAuthProvider.KAKAO });
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);

      // When, Then
      await expect(sut.githubOAuth('dummy_code', 'dummy_redirectUri')).rejects.toThrow(DuplicateEmailException);
    });

    it('회원가입이 되어있지 않은 경우 깃허브로 회원가입을 시도한다', async () => {
      // Given
      const email = generateUUID();

      const githubOAuthToken = createGithubOAuthToken();
      jest.spyOn(httpService, 'post').mockResolvedValueOnce(githubOAuthToken);

      const githubUserInfo = createGithubUserInfo(email);
      jest.spyOn(httpService, 'get').mockResolvedValueOnce(githubUserInfo);

      // When
      await sut.githubOAuth('dummy_code', 'dummy_redirectUri');

      // Then
      expect(authService.register).toHaveBeenCalledWith(email, UserOAuthProvider.GITHUB);
    });
  });
});
