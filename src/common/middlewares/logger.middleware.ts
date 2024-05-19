import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export default class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP'); // HTTP(context)의 역할 -> HTTP 관련된 요청에서만 logger가 실행 됨 , express의 debug 라이브러리와 같은 역할

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;

    // 응답이 끝났을 때
    response.on('finish', () => {
      const { statusCode } = response;
      this.logger.log(`${method} - ${originalUrl} ${statusCode}`);
    });

    next();
  }
}
