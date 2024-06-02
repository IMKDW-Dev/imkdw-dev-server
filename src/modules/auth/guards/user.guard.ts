import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserMismatchException } from '../../../common/exceptions/403';

@Injectable()
export default class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const requesterId = request.user.userId;
    const paramUserId = request.params.userId;

    if (paramUserId !== requesterId) {
      throw new UserMismatchException(requesterId, paramUserId);
    }

    return requesterId === paramUserId;
  }
}
