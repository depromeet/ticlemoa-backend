import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider } from '../entities/types/auth-provider.enum';
import { UserRepository } from '../user/repository/user.repository';
import { JwtSubjectType } from './types/jwtSubjectType';
import { ConfigService } from '@nestjs/config';
import { LoginRequestDto } from './dto/login-request.dto';
import axios from 'axios';
import { TokenResponse } from './types/token-response.interface';
import { User } from '../entities/user.entity';
import { JwtPayload } from './types/jwt-payload.interface';
import * as jwksClient from 'jwks-rsa';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async login(data: LoginRequestDto): Promise<TokenResponse> {
    let userId: number;
    try {
      switch (data.provider) {
        case AuthProvider.KAKAO: {
          userId = await this.getUserByKakaoAccessToken(data.accessToken);
          break;
        }
        case AuthProvider.NAVER: {
          userId = await this.getUserByNaverAccessToken(data.accessToken);
          break;
        }
        case AuthProvider.GOOGLE: {
          userId = await this.getUserByGoogleAccessToken(data.accessToken);
          break;
        }
        case AuthProvider.APPLE: {
          userId = await this.getUserByAppleIdentifyToken(data.accessToken);
          break;
        }
        default: {
          throw new BadRequestException({
            message: '제공하지 않는 OAuth 요청입니다.',
          });
        }
      }
    } catch (error) {
      throw new BadRequestException({
        message: '유효하지 않는 OAuth 요청입니다.',
      });
    }

    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);

    this.setCurrentRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken, userId };
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
      });
    }

    const kakaoData = user.data;
    const snsId = String(kakaoData.id);
    const existedUser = await this.userRepository.findOne({ where: { snsId } });

    if (!existedUser) {
      const randomNicknameReq = await axios.get('https://nickname.hwanmoo.kr/?format=json&count=1&max_length=6');
      const nickname = randomNicknameReq.data.words[0];
      const { profile_image: avatarUrl } = kakaoData.properties;
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
      });
    }

    const naverResponse = user.data.response;
    const snsId = naverResponse.id;
    const existedUser = await this.userRepository.findOne({ where: { snsId } });

    if (!existedUser) {
      const randomNicknameReq = await axios.get('https://nickname.hwanmoo.kr/?format=json&count=1&max_length=6');
      const nickname = randomNicknameReq.data.words[0];
      const { profile_image: avatarUrl, email } = naverResponse;
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

  async getUserByGoogleAccessToken(accessToken: string): Promise<number> {
    const user = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!user) {
      throw new BadRequestException({
        message: '구글 로그인에 실패했습니다',
      });
    }

    const googleData = user.data;
    const snsId = googleData.id;
    const existedUser = await this.userRepository.findOne({ where: { snsId } });

    if (!existedUser) {
      const randomNicknameReq = await axios.get('https://nickname.hwanmoo.kr/?format=json&count=1&max_length=6');
      const nickname = randomNicknameReq.data.words[0];
      const { picture: avatarUrl, email } = googleData;
      const { id } = await this.userRepository.save({
        snsId,
        email,
        nickname,
        avatarUrl,
        provider: AuthProvider.GOOGLE,
      });
      return id;
    }

    return existedUser.id;
  }

  async getAppleSigningKey(kid: string) {
    // Public key 생성을 위해 요청 전송
    const client = jwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });

    const key = await client.getSigningKey(kid);

    return key.getPublicKey();
  }

  async getUserByAppleIdentifyToken(identifyToken: string) {
    try {
      // App에서 전달받은 identify token의 header 파싱
      const json = this.jwtService.decode(identifyToken, { complete: true });
      const kid = json['header'].kid;
      const appleKey = await this.getAppleSigningKey(kid);

      if (!appleKey) {
        throw new BadRequestException();
      }
      const { sub: snsId, email } = this.jwtService.verify(identifyToken, {
        algorithms: ['RS256'],
        secret: appleKey,
      });
      const existedUser = await this.userRepository.findOne({ where: { snsId } });

      if (!existedUser) {
        const randomNicknameReq = await axios.get('https://nickname.hwanmoo.kr/?format=json&count=1&max_length=6');
        const nickname = randomNicknameReq.data.words[0];
        const { id } = await this.userRepository.save({
          snsId,
          email,
          nickname,
          provider: AuthProvider.APPLE,
        });
        return id;
      }

      return existedUser.id;
    } catch {
      throw new BadRequestException();
    }
  }

  async freelogin() {
    try {
      const randomNicknameReq = await axios.get('https://nickname.hwanmoo.kr/?format=json&count=1&max_length=6');
      const nickname = randomNicknameReq.data.words[0];

      const { id: userId } = await this.userRepository.save({
        snsId: uuidv4(),
        nickname,
        provider: AuthProvider.NYONG,
      });

      const accessToken = this.generateAccessToken(userId);
      const refreshToken = this.generateRefreshToken(userId);

      this.setCurrentRefreshToken(userId, refreshToken);

      return { accessToken, refreshToken, userId };
    } catch {
      throw new BadRequestException();
    }
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

  setCurrentRefreshToken(userId: number, refreshToken: string): void {
    this.userRepository.update(userId, { refreshToken: refreshToken });
  }

  async rotateRefreshToken(userId: number, prevRefreshToken: string): Promise<TokenResponse> {
    try {
      await this.checkRefreshToken(prevRefreshToken);
      const accessToken = this.generateAccessToken(userId);
      const refreshToken = this.generateRefreshToken(userId);
      this.setCurrentRefreshToken(userId, refreshToken);
      return { accessToken, refreshToken, userId };
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  async checkRefreshToken(refreshToken: string): Promise<void> {
    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
    });
    const { refreshToken: userRefreshToken } = await this.userRepository.findOne({
      where: { id: payload.id },
      select: { refreshToken: true },
    });
    if (refreshToken !== userRefreshToken) {
      throw new UnauthorizedException();
    }
  }

  async deleteRefreshToken(userId: number): Promise<void> {
    try {
      await this.userRepository.update(userId, { refreshToken: null });
    } catch {
      throw new BadRequestException();
    }
  }

  // TODO 향후 고도화
  // async withdraw(userId: number, accessToken: string): Promise<void> {
  async withdraw(accessToken: string): Promise<void> {
    try {
      // const { provider } = await this.userRepository.findOne({ where: { id: userId } });
      // let url: string,
      //   method = 'GET';
      // switch (provider) {
      //   case AuthProvider.KAKAO: {
      //     url = 'https://kapi.kakao.com/v1/user/unlink';
      //     break;
      //   }
      //   case AuthProvider.NAVER: {
      //     url = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${this.configService.get(
      //       'NAVER_CLIENT_ID',
      //     )}&client_secret=${this.configService.get(
      //       'NAVER_SECRET',
      //     )}&access_token=${accessToken}&service_provider=NAVER`;
      //     break;
      //   }
      //   case AuthProvider.GOOGLE: {
      //     url = `https://oauth2.googleapis.com/revoke?token=${accessToken}`;
      //     method = 'POST';
      //     break;
      //   }
      //   case AuthProvider.NYONG: {
      //     await this.userRepository.softDelete(userId);
      //     return;
      //   }
      //   default: {
      //     throw new BadRequestException();
      //   }
      // }
      // await axios({
      //   url,
      //   method,
      //   headers: { Authorization: `Bearer ${accessToken}` },
      // });
      const userId = this.jwtService.decode(accessToken)['id'];
      await this.userRepository.softDelete(userId);
    } catch {
      throw new UnauthorizedException('유효하지 않은 OAuth 요청입니다.');
    }
  }
}
