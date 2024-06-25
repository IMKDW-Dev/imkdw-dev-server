import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiHeader, ApiOperation } from '@nestjs/swagger';
import ResponseAuthResultDto from '../dto/response/auth-result.dto';
import ReqeustKakaoOAuthDto from '../dto/request/kakao-oauth.dto';
import ReqeustGithubOAuthDto from '../dto/request/github-oauth.dto';

export const googleOAuth = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiHeader({
      name: 'Authorization',
      description: '구글에서 발급해준 토큰을 전달, ex) Bearer <access_token>',
    }),
    ApiCreatedResponse({ type: ResponseAuthResultDto }),
  );

export const kakaoOAuth = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: ReqeustKakaoOAuthDto }),
    ApiCreatedResponse({ type: ResponseAuthResultDto }),
  );

export const githubOAuth = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: ReqeustGithubOAuthDto }),
    ApiCreatedResponse({ type: ResponseAuthResultDto }),
  );
