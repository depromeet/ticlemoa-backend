import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('kakao/redirect')
  @UseGuards(KakaoAuthGuard)
  async kakaoLoginRedirect() {
    return {};
  }
}
