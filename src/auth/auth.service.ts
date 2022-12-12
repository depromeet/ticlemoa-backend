import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider } from '../entities/types/auth-provider.enum';
import { UserRepository } from '../user/repository/user.repository';
import { JwtSubjectType } from './types/jwtSubjectType';
import { ConfigService } from '@nestjs/config';
import { LoginRequest } from './dto/login-request.dto';
import axios from 'axios';
import { TokenResponse } from './types/token-response.interface';
import { User } from '../entities/user.entity';

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
      case 'naver': {
        userId = await this.getUserByNaverAccessToken(data.accessToken);
        break;
      }
      default: {
        throw new BadRequestException({
          message: '유효하지 않는 OAuth 요청입니다.',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    }

    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);

    return { accessToken, refreshToken };
  }

  async validateJwt(id: number): Promise<User> {
    return await this.userRepository.findOneOrFail({ where: { id } });
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

    const kakaoData = user.data;
    const snsId = String(kakaoData.id);
    const existedUser = await this.userRepository.findOne({ where: { snsId } });

    if (!existedUser) {
      const { nickname, profile_image: avatarUrl } = kakaoData.properties;
      const kakaoAccount = kakaoData.kakao_account;
      const email = kakaoAccount.has_email && !kakaoAccount.email_needs_agreement ? kakaoAccount.email : null;
      const { id } = await this.userRepository.save({
        snsId,
        email,
        nickname,
        avatarUrl,
        provider: AuthProvider.KAKAO,
      });
      return id;
    }

    return existedUser.id;
  }

  async getUserByNaverAccessToken(accessToken: string): Promise<number> {
    const user = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!user) {
      throw new BadRequestException({
        message: '네이버 로그인에 실패했습니다',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const naverResponse = user.data.response;
    const snsId = naverResponse.id;
    const existedUser = await this.userRepository.findOne({ where: { snsId } });

    if (!existedUser) {
      const { nickname, profile_image: avatarUrl, email } = naverResponse;
      const { id } = await this.userRepository.save({
        snsId,
        email,
        nickname,
        avatarUrl,
        provider: AuthProvider.NAVER,
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
