import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UserRequest } from '../common/decorators/user-request.decorator';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/login-request.dto';
import { AccessToken } from './types/token-response.interface';
import { KakaoAuthGuard } from './utils/guards/kakao-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @Post('kakao/login')
  async kakaoLogin(@Body() kakaoData: LoginRequest, @Res({ passthrough: true }) res: Response): Promise<AccessToken> {
    const { accessToken, refreshToken } = await this.authService.login(kakaoData);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') * 1000,
    });
    return { accessToken };
  }

  // 정식 배포 전까지 액세스 토큰을 원활하게 탐색하기 위해 남겨놓았습니다.
  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  deprecatedKakaoLogin() {
    return 'success';
  }
  @Get('kakao/redirect')
  @UseGuards(KakaoAuthGuard)
  deprecatedKakaoRedirect(@UserRequest() accessToken): void {
    console.log(accessToken);
  }
}
