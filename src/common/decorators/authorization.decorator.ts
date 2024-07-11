import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const Authorization = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const authorization = req.headers?.authorization ?? '';

  if (!authorization || !authorization.includes('Bearer ')) {
    return '';
  }

  return req.headers.authorization.replace('Bearer ', '');
});

export default Authorization;
