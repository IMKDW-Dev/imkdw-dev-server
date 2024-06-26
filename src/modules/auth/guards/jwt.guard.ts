import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { IRequester } from '../../../common/types/common.type';
import TokenService from '../../token/services/token.service';
import UserService from '../../user/services/user.service';

@Injectable()
export default class JwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest<Request>();
    const { accessToken } = this.tokenService.parseJwtTokenByCookie(request.headers.cookie);

    try {
      const userId = this.tokenService.verify(accessToken) ?? '';

      const user = await this.userService.findOne({ id: userId });
      if (!user) {
        throw new UnauthorizedException();
      }

      const requester: IRequester = { userId: user.getId(), role: user.getRole() };
      request.user = requester;
      return true;
    } catch {
      /**
       * JWT 토큰 파싱 혹은 유저 정보 조회시 퍼블릭 API의 경우에는 통과된다.
       * 퍼블릭 API가 아닌 경우에는 UnauthorizedException이 발생
       */
      if (isPublic) {
        return true;
      }

      throw new UnauthorizedException();
    }
  }
}
