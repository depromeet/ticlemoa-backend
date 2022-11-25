import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../../entities/user.entity';
import { AuthService } from '../../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Authorization;
        },
      ]),
      ignoreExipration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: Partial<User>): Promise<User> {
    try {
      return await this.authService.validateJwt(payload.id, payload.provider);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
