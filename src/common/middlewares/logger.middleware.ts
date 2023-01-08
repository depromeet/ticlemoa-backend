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
      if (userAgent?.includes('ELB-HealthChecker')) {
        return;
      }
      if (xForwardedFor?.includes('54.180.108.247')) {
        return;
      }
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${xForwardedFor} ${userAgent}           ${body}             ${authorization}`,
      );
    });

    next();
  }
}
