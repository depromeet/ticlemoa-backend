import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserRequest } from '../common/decorators/user-request.decorator';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { AccessToken } from './types/accessToken.interface';
import { KakaoAuthGuard } from './utils/guards/kakao-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  kakaoLogin(): HttpStatus {
    return HttpStatus.OK;
  }

  @Get('kakao/redirect')
  @UseGuards(KakaoAuthGuard)
  async kakaoLoginRedirect(@UserRequest() user: User, @Res({ passthrough: true }) res: Response): Promise<AccessToken> {
    return this.authService.logIn(user, res);
  }
}
