import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from 'src/auth/types/jwt-payload.interface';
import { AuthService } from '../../auth.service';
import { jwtPayload } from '../../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExipration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: jwtPayload): Promise<UserPayload> {
    try {
      await this.authService.validateJwt(payload.id);
      return { userId: payload.id };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
