import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UserRequest } from '../common/decorators/user-request.decorator';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { AccessToken } from './types/accessToken.interface';
import { KakaoAuthGuard } from './utils/guards/kakao-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  kakaoLogin(): HttpStatus {
    return HttpStatus.OK;
  }

  @Get('kakao/redirect')
  @UseGuards(KakaoAuthGuard)
  async kakaoLoginRedirect(@UserRequest() user: User, @Res({ passthrough: true }) res: Response): Promise<AccessToken> {
    const accessToken = this.authService.generateAccessToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    res.cookie('Authorization', accessToken, {
      httpOnly: true,
      maxAge: +this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME') * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') * 1000,
    });

    return { accessToken };
  }
}
