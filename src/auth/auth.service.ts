import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Profile } from 'passport-kakao';
import { JwtSubjectType } from './types/jwt.type';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private configService: ConfigService) {}

  // async validateUser(profile: Profile) {
  //   const { id, provider, displayname: nickname } = profile;
  //   const email = profile._json.kakao_account.email;
  //   const exUser = await this.userRepository.findOne({
  //     where: { email },
  //     select: ['id', 'email', 'nickname'],
  //   });
  //   if (!exUser) {
  //     const newUser = await this.userRepository.create({
  //       id
  //       email
  //       nickname
  //       provider
  //     });
  //     return newUser;
  //   }
  //   return exUser;
  // }

  async logIn(user, res: Response) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    res.cookie('Authorization', accessToken, {
      // TODO 만료기간 설정
      httpOnly: true,
    });

    res.cookie('refresh_token', refreshToken, {
      // TODO 만료기간 설정
      httpOnly: true,
    });

    return { accessToken };
  }

  // TODO 토큰 expiresIn 추가
  generateAccessToken(user) {
    return this.jwtService.sign({ user }, { subject: JwtSubjectType.ACCESS });
  }

  generateRefreshToken(user) {
    return this.jwtService.sign({ user }, { subject: JwtSubjectType.REFRESH });
  }
}
