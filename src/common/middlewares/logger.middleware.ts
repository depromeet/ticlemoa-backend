import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const body = JSON.stringify(request.body);
      const authorization = request.headers['authorization'];
      const xForwardedFor = request.headers['x-forwarded-for'];
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${xForwardedFor} ${userAgent} \n ${body} \n ${authorization}`,
      );
    });

    next();
  }
}
