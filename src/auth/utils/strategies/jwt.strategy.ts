import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Authorization;
        },
      ]),
      ignoreExipration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // TODO 반환 타입(Partial) 및 페이로드 DTO 작성
  async validate(payload: any): Promise<any> {
    return { email: payload.email, nickname: payload.nickname };
  }
}
