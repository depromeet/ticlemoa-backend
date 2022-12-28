import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UserRequest } from '../common/decorators/user-request.decorator';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { AccessToken } from './types/token-response.interface';
import { GoogleAuthGuard } from './utils/guards/google-auth.guard';
import { KakaoAuthGuard } from './utils/guards/kakao-auth.guard';
import { NaverAuthGuard } from './utils/guards/naver-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @Post('*/login')
  @ApiOperation({ description: 'OAuth 로그인' })
  @ApiBody({
    description: 'OAuth 액세스 토큰(AccessToken) 및 제공자(vendor)',
    type: LoginRequestDto,
    examples: {
      loginRequestDto: { value: { accessToken: 'yg1wdaf(해시 문자열)', vendor: 'kakao|google|naver|apple' } },
    },
  })
  @ApiCreatedResponse({ description: '로그인/회원가입 성공', type: LoginResponseDto })
  @ApiBadRequestResponse({ description: '유효하지 않은 제공자 혹은, 해당 SNS 로그인에 동의하지 않음' })
  async oauthLogin(
    @Body() loginRequestdto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessToken> {
    const { accessToken, refreshToken } = await this.authService.login(loginRequestdto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') * 1000,
    });
    return { accessToken };
  }

  // 정식 배포 전까지 액세스 토큰을 원활하게 탐색하기 위해 남겨놓았습니다.
  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  @ApiOperation({ deprecated: true, description: '카카오 계정 테스트를 위한 임시 API' })
  deprecatedKakaoLogin(): string {
    return 'success';
  }
  @Get('kakao/redirect')
  @UseGuards(KakaoAuthGuard)
  @ApiOperation({ deprecated: true, description: '카카오 계정 테스트를 위한 임시 API - Redirect' })
  deprecatedKakaoRedirect(@UserRequest() accessToken: AccessToken): void {
    console.log(accessToken);
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  @ApiOperation({ deprecated: true, description: '네이버 계정 테스트를 위한 임시 API' })
  deprecatedNaverLogin(): string {
    return 'success';
  }
  @Get('naver/redirect')
  @UseGuards(NaverAuthGuard)
  @ApiOperation({ deprecated: true, description: '네이버 계정 테스트를 위한 임시 API - Redirect' })
  deprecatedNaverRedirect(@UserRequest() accessToken: AccessToken): void {
    console.log(accessToken);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ deprecated: true, description: '구글 계정 테스트를 위한 임시 API' })
  deprecatedGoogleLogin(): string {
    return 'success';
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ deprecated: true, description: '구글 계정 테스트를 위한 임시 API - Redirect' })
  deprecatedGoogleRedirect(@UserRequest() accessToken: AccessToken): void {
    console.log(accessToken);
  }

  @Get('testingapi')
  @ApiExcludeEndpoint()
  test(@Res({ passthrough: true }) res: Response) {
    const accessToken = this.authService.generateAccessToken(1);
    const refreshToken = this.authService.generateRefreshToken(1);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') * 1000,
    });
    return { accessToken };
  }
}
