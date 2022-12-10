import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider } from '../entities/types/auth-provider.interface';
import { UserRepository } from '../user/repository/user.repository';
import { JwtSubjectType } from './types/jwt.type';
import { ConfigService } from '@nestjs/config';
import { LoginRequest } from './dto/login-request.dto';
import axios from 'axios';
import { TokenResponse } from './types/token-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async login(data: LoginRequest): Promise<TokenResponse> {
    let userId: number;
    switch (data.vendor) {
      case 'kakao': {
        userId = await this.getUserByKakaoAccessToken(data.accessToken);
        break;
      }
      default: {
        throw new BadRequestException({
          message: '지원하지 않는 OAuth 요청입니다.',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    }

    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);

    return { accessToken, refreshToken };
  }

  async validateJwt(id: number, provider: AuthProvider) {
    return await this.userRepository.findOneOrFail({ where: { id, provider } });
  }

  async getUserByKakaoAccessToken(accessToken: string): Promise<number> {
    const user = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!user) {
      throw new BadRequestException({
        message: '카카오 로그인에 실패했습니다',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const snsId = String(user.data.id);
    const existedUser = await this.userRepository.findOneBySnsId(snsId);

    if (!existedUser) {
      const { nickname, profile_image: avatarUrl } = user.data.properties;
      const kakaoAccount = user.data.kakao_account;
      const email = kakaoAccount.has_email && !kakaoAccount.email_needs_agreement ? kakaoAccount.email : null;
      const { id } = await this.userRepository.createUser({
        snsId,
        email,
        nickname,
        avatarUrl,
        provider: AuthProvider.kakao,
      });
      return id;
    }

    return existedUser.id;
  }

  generateAccessToken(userId: number): string {
    return this.jwtService.sign(
      { id: userId },
      {
        subject: JwtSubjectType.ACCESS,
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
      },
    );
  }

  generateRefreshToken(userId: number): string {
    return this.jwtService.sign(
      { id: userId },
      {
        subject: JwtSubjectType.REFRESH,
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
      },
    );
  }
}
