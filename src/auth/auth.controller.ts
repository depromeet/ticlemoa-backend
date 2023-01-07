import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserRequest } from '../common/decorators/user-request.decorator';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { AccessToken } from './types/token-response.interface';
import { GoogleAuthGuard } from './utils/guards/google-auth.guard';
import { KakaoAuthGuard } from './utils/guards/kakao-auth.guard';
import { NaverAuthGuard } from './utils/guards/naver-auth.guard';
import { UserPayload } from './types/jwt-payload.interface';
import { Auth } from './decorator/auth.decorator';
import { WithdrawRequestDto } from './dto/withdraw-request.dto';

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
      loginRequestDto: { value: { accessToken: 'yg1wdaf(OAuth Access Token)', provider: 'KAKAO|GOOGLE|NAVER|APPLE' } },
    },
  })
  @ApiCreatedResponse({ description: '로그인/회원가입 성공', type: LoginResponseDto })
  @ApiBadRequestResponse({ description: '유효하지 않은 제공자 혹은, 해당 SNS 로그인에 동의하지 않음' })
  async oauthLogin(
    @Body() loginRequestdto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const { accessToken, refreshToken, userId } = await this.authService.login(loginRequestdto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') * 1000,
    });
    return { accessToken, userId };
  }

  // 정식 배포 전까지 액세스 토큰을 원활하게 탐색하기 위해 남겨놓았습니다.
  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({ deprecated: true, description: '카카오 계정 테스트를 위한 임시 API' })
  deprecatedKakaoLogin(): string {
    return 'success';
  }

  @Get('kakao/redirect')
  @UseGuards(KakaoAuthGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({ deprecated: true, description: '카카오 계정 테스트를 위한 임시 API - Redirect' })
  deprecatedKakaoRedirect(@UserRequest() accessToken: AccessToken): void {
    console.log(accessToken);
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({ deprecated: true, description: '네이버 계정 테스트를 위한 임시 API' })
  deprecatedNaverLogin(): string {
    return 'success';
  }

  @Get('naver/redirect')
  @UseGuards(NaverAuthGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({ deprecated: true, description: '네이버 계정 테스트를 위한 임시 API - Redirect' })
  deprecatedNaverRedirect(@UserRequest() accessToken: AccessToken): void {
    console.log(accessToken);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({ deprecated: true, description: '구글 계정 테스트를 위한 임시 API' })
  deprecatedGoogleLogin(): string {
    return 'success';
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({ deprecated: true, description: '구글 계정 테스트를 위한 임시 API - Redirect' })
  deprecatedGoogleRedirect(@UserRequest() accessToken: AccessToken): void {
    console.log(accessToken);
  }

  @Get('testingapi')
  @ApiExcludeEndpoint()
  test(@Res({ passthrough: true }) res: Response) {
    const accessToken = this.authService.generateAccessToken(1);
    const refreshToken = this.authService.generateRefreshToken(1);
    this.authService.setCurrentRefreshToken(1, refreshToken);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') * 1000,
    });
    return { accessToken };
  }

  @Post('refresh')
  @Auth()
  @ApiOperation({
    description: 'refesh 토큰을 사용하여 access 토큰을 재발급합니다. RTR로 refresh 토큰도 재발급합니다,',
  })
  @ApiCreatedResponse({ description: 'access token 재발급 성공', type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: '유효하지 않은 refresh token으로 access token 재발급에 실패했습니다.' })
  @ApiBadRequestResponse({ description: '유효하지 않은 요청입니다.' })
  async refresh(
    @UserRequest() { userId }: UserPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const prevRefreshToken = req.cookies['refresh_token'];
    const { accessToken, refreshToken } = await this.authService.rotateRefreshToken(userId, prevRefreshToken);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') * 1000,
    });
    return { accessToken, userId };
  }

  @Post('logout')
  @HttpCode(204)
  @Auth()
  @ApiOperation({ description: 'refresh_token 쿠키를 삭제하고, 유저 테이블에 있는 refresh 토큰을 null로 수정합니다.' })
  @ApiNoContentResponse({ description: '로그아웃에 성공했습니다.' })
  @ApiBadRequestResponse({ description: '유효하지 않은 요청입니다.' })
  async logout(@UserRequest() { userId }: UserPayload, @Res({ passthrough: true }) res: Response): Promise<void> {
    await this.authService.deleteRefreshToken(userId);
    res.clearCookie('refresh_token');
  }

  @Post('withdraw')
  @HttpCode(204)
  @Auth()
  @ApiBody({
    description: 'OAuth 액세스 토큰',
    type: WithdrawRequestDto,
    examples: { withdrawRequestDto: { value: { accessToken: 'yg1wdaf(OAuth Access Token)' } } },
  })
  @ApiOperation({ description: '회원탈퇴' })
  @ApiNoContentResponse({ description: '회원탈퇴에 성공했습니다.' })
  @ApiBadRequestResponse({ description: '유효하지 않은 OAuth 요청입니다.' })
  async withdraw(
    @Body() withdrawRequestDto: WithdrawRequestDto,
    @UserRequest() { userId }: UserPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.withdraw(userId, withdrawRequestDto.accessToken);
    res.clearCookie('refresh_token');
  }
}
