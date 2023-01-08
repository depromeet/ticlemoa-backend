import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('만료된 access 토큰입니다.');
    }
    if (!user) {
      throw new UnauthorizedException('적절하지 않은 요청입니다.');
    }
    return user;
  }
}
