import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { KakaoStrategy } from './utils/strategies/kakao.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './utils/strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { GoogleStrategy } from './utils/strategies/google.strategy';
import { NaverStrategy } from './utils/strategies/naver.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: `${configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s` },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy, JwtStrategy, NaverStrategy, GoogleStrategy],
})
export class AuthModule {}
