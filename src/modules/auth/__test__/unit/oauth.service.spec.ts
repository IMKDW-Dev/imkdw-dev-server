import { TestBed } from '@automock/jest';
import OAuthService from '../../services/oauth.service';
import { HTTP_REST_SERVICE, IHttpRestService } from '../../../../infra/http/rest/interfaces/http-rest.interface';
import { createGoogleOAuthUserInfo } from '../fixtures/google-oauth.fixture';
import { DuplicateEmailException } from '../../../../common/exceptions/409';
import { createUser } from '../../../user/__test__/fixtures/create-user.fixture';
import UserService from '../../../user/services/user.service';
import UserOAuthProvider from '../../../user/domain/models/user-oauth-provider.model';
import AuthService from '../../services/auth.service';
import { createKakaoOAuthToken, createKakaoUserInfo } from '../fixtures/kakao-oauth.fixture';
import { createGithubOAuthToken, createGithubUserInfo } from '../fixtures/github-oauth.fixture';

describe('OAuthService', () => {
  let sut: OAuthService;
  let authService: AuthService;
  let httpRestService: IHttpRestService;
  let userService: UserService;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(OAuthService).compile();
    sut = unit;
    httpRestService = unitRef.get<IHttpRestService>(HTTP_REST_SERVICE);
    authService = unitRef.get<AuthService>(AuthService);
    userService = unitRef.get<UserService>(UserService);
  });

  describe('구글 소셜로그인', () => {
    describe('기존에 다른 OAuth로 가입된 이메일이 주어지고', () => {
      const user = createUser({ provider: UserOAuthProvider.GITHUB });
      const googleUserInfo = createGoogleOAuthUserInfo({ email: user.getEmail() });

      describe('소셜로그인을 시도하면', () => {
        it('예외가 발생한다', async () => {
          jest.spyOn(httpRestService, 'get').mockResolvedValue(googleUserInfo);
          jest.spyOn(userService, 'findOne').mockResolvedValue(user);
          await expect(sut.googleOAuth('accessToken')).rejects.toThrow(DuplicateEmailException);
        });
      });
    });

    describe('기존에 구글로 가입된 이메일이 주어지고', () => {
      const user = createUser({ provider: UserOAuthProvider.GOOGLE });
      const googleUserInfo = createGoogleOAuthUserInfo({ email: user.getEmail() });

      describe('소셜로그인을 시도하면', () => {
        it('로그인을 시도한다', async () => {
          jest.spyOn(httpRestService, 'get').mockResolvedValue(googleUserInfo);
          jest.spyOn(userService, 'findOne').mockResolvedValue(user);
          const authServiceSpy = jest.spyOn(authService, 'login');

          await sut.googleOAuth('accessToken');
          expect(authServiceSpy).toHaveBeenCalledWith(user.getId());
        });
      });
    });

    describe('기존에 존재하지 않던 이메일이 주어지고', () => {
      const email = 'email';
      describe('소셜로그인을 시도하면', () => {
        it('회원가입을 시도한다', async () => {
          jest.spyOn(httpRestService, 'get').mockResolvedValue(createGoogleOAuthUserInfo({ email }));
          jest.spyOn(userService, 'findOne').mockResolvedValue(null);
          const authServiceSpy = jest.spyOn(authService, 'register');

          await sut.googleOAuth('accessToken');
          expect(authServiceSpy).toHaveBeenCalledWith(email, UserOAuthProvider.GOOGLE);
        });
      });
    });
  });

  describe('카카오 소셜로그인', () => {
    describe('기존에 다른 OAuth로 가입된 이메일이 주어지고', () => {
      const user = createUser({ provider: UserOAuthProvider.GOOGLE });
      const token = createKakaoOAuthToken();
      const userInfo = createKakaoUserInfo(user.getEmail());

      describe('소셜로그인을 시도하면', () => {
        it('예외가 발생한다', async () => {
          jest.spyOn(httpRestService, 'post').mockResolvedValue(token);
          jest.spyOn(httpRestService, 'get').mockResolvedValue(userInfo);
          jest.spyOn(userService, 'findOne').mockResolvedValue(user);
          await expect(sut.kakaoOAuth('code', 'redirectUri')).rejects.toThrow(DuplicateEmailException);
        });
      });
    });

    describe('기존에 카카오로 가입된 이메일이 주어지고', () => {
      const user = createUser({ provider: UserOAuthProvider.KAKAO });
      const kakaoToken = createKakaoOAuthToken();
      const googleUserInfo = createKakaoUserInfo(user.getEmail());

      describe('소셜로그인을 시도하면', () => {
        it('로그인을 시도한다', async () => {
          jest.spyOn(httpRestService, 'post').mockResolvedValue(kakaoToken);
          jest.spyOn(httpRestService, 'get').mockResolvedValue(googleUserInfo);
          jest.spyOn(userService, 'findOne').mockResolvedValue(user);
          const authServiceSpy = jest.spyOn(authService, 'login');

          await sut.kakaoOAuth('code', 'redirectUri');
          expect(authServiceSpy).toHaveBeenCalledWith(user.getId());
        });
      });
    });

    describe('기존에 존재하지 않던 이메일이 주어지고', () => {
      const email = 'email';
      describe('소셜로그인을 시도하면', () => {
        it('회원가입을 시도한다', async () => {
          jest.spyOn(httpRestService, 'post').mockResolvedValue(createKakaoOAuthToken());
          jest.spyOn(httpRestService, 'get').mockResolvedValue(createKakaoUserInfo(email));
          jest.spyOn(userService, 'findOne').mockResolvedValue(null);

          const authServiceSpy = jest.spyOn(authService, 'register');

          await sut.kakaoOAuth('code', 'redirectUri');
          expect(authServiceSpy).toHaveBeenCalledWith(email, UserOAuthProvider.KAKAO);
        });
      });
    });
  });

  describe('깃허브 소셜로그인', () => {
    describe('기존에 다른 OAuth로 가입된 이메일이 주어지고', () => {
      const user = createUser({ provider: UserOAuthProvider.GOOGLE });
      const token = createGithubOAuthToken();
      const userInfo = createGithubUserInfo(user.getEmail());

      describe('소셜로그인을 시도하면', () => {
        it('예외가 발생한다', async () => {
          jest.spyOn(httpRestService, 'post').mockResolvedValue(token);
          jest.spyOn(httpRestService, 'get').mockResolvedValue(userInfo);
          jest.spyOn(userService, 'findOne').mockResolvedValue(user);
          await expect(sut.githubOAuth('code', 'redirectUri')).rejects.toThrow(DuplicateEmailException);
        });
      });
    });

    describe('기존에 깃허브 가입된 이메일이 주어지고', () => {
      const user = createUser({ provider: UserOAuthProvider.GITHUB });
      const token = createGithubOAuthToken();
      const userInfo = createGithubUserInfo(user.getEmail());

      describe('소셜로그인을 시도하면', () => {
        it('로그인을 시도한다', async () => {
          jest.spyOn(httpRestService, 'post').mockResolvedValue(token);
          jest.spyOn(httpRestService, 'get').mockResolvedValue(userInfo);
          jest.spyOn(userService, 'findOne').mockResolvedValue(user);
          const authServiceSpy = jest.spyOn(authService, 'login');

          await sut.githubOAuth('code', 'redirectUri');
          expect(authServiceSpy).toHaveBeenCalledWith(user.getId());
        });
      });
    });

    describe('기존에 존재하지 않던 이메일이 주어지고', () => {
      const email = 'email';
      describe('소셜로그인을 시도하면', () => {
        it('회원가입을 시도한다', async () => {
          jest.spyOn(httpRestService, 'post').mockResolvedValue(createGithubOAuthToken());
          jest.spyOn(httpRestService, 'get').mockResolvedValue(createGithubUserInfo(email));
          jest.spyOn(userService, 'findOne').mockResolvedValue(null);

          const authServiceSpy = jest.spyOn(authService, 'register');

          await sut.githubOAuth('code', 'redirectUri');
          expect(authServiceSpy).toHaveBeenCalledWith(email, UserOAuthProvider.GITHUB);
        });
      });
    });
  });
});
