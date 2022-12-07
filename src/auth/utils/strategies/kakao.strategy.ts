import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../../auth.service';
import { KakaoProfile } from '../../types/kakao-profile.interface';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      clientSecret: configService.get<string>('KAKAO_SECRET'),
      callbackURL: configService.get<string>('KAKAO_CALLBACK_URL'),
      scopeSeparator: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: KakaoProfile,
    done: CallableFunction,
  ): Promise<void> {
    done(null, _accessToken);
  }
}
