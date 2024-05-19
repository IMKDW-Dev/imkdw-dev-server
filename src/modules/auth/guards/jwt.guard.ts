import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IMyJwtService, MY_JWT_SERVICE } from '../../../infra/secure/jwt/interfaces/my-jwt.interface';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { IRequester } from '../../../common/types/common.type';
import UserQueryService from '../../user/services/user-query.service';

@Injectable()
export default class JwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(MY_JWT_SERVICE) private readonly myJwtService: IMyJwtService,
    private readonly userQueryService: UserQueryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    /**
     * 퍼블릭 API의 경우에는 토큰이 없어도 통과된다
     * 퍼블릭 API가 아닌 경우에는 토큰이 없으면 UnauthorizedException이 발생
     */
    if (!token) {
      if (isPublic) return true;
      throw new UnauthorizedException();
    }

    try {
      const userId = this.myJwtService.verify(token);

      const user = await this.userQueryService.findOne({ id: userId });
      if (!user) throw new UnauthorizedException();

      const requester: IRequester = { userId: user.getId(), role: user.getRole().getName() };
      request.user = requester;
      return true;
    } catch {
      /**
       * JWT 토큰 파싱 혹은 유저 정보 조회시 퍼블릭 API의 경우에는 통과된다.
       * 퍼블릭 API가 아닌 경우에는 UnauthorizedException이 발생
       */
      if (isPublic) return true;
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
