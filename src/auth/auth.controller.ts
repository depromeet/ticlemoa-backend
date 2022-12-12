import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UserRequest } from '../common/decorators/user-request.decorator';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/login-request.dto';
import { AccessToken } from './types/token-response.interface';
import { KakaoAuthGuard } from './utils/guards/kakao-auth.guard';
import { NaverAuthGuard } from './utils/guards/naver-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @Post('*/login')
  async oauthLogin(
    @Body() loginRequest: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessToken> {
    const { accessToken, refreshToken } = await this.authService.login(loginRequest);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') * 1000,
    });
    return { accessToken };
  }

  // 정식 배포 전까지 액세스 토큰을 원활하게 탐색하기 위해 남겨놓았습니다.
  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  deprecatedKakaoLogin(): string {
    return 'success';
  }
  @Get('kakao/redirect')
  @UseGuards(KakaoAuthGuard)
  deprecatedKakaoRedirect(@UserRequest() accessToken: AccessToken): void {
    console.log(accessToken);
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  deprecatedNaverLogin(): string {
    return 'success';
  }
  @Get('naver/redirect')
  @UseGuards(NaverAuthGuard)
  deprecatedNaverRedirect(@UserRequest() accessToken: AccessToken): void {
    console.log(accessToken);
  }
}
