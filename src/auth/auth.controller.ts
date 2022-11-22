import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { User } from '../common/decorators/user.decorator';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './utils/guards/kakao-auth.guard';

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
  async kakaoLoginRedirect(@User() user, @Res({ passthrough: true }) res) {
    await this.authService.logIn(user, res);
  }
}
