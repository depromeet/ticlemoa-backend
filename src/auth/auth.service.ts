import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-kakao';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(profile: Profile['_json']) {
    // const profile
    // const exUser = await this.userRepository.findOne({
    //   where: { email },
    //   select: ['id', 'email', 'nickname'],
    // });
    // if (!exUuser) {
    //   const newUser = await this.userRepository.create({
    //     id: profile.id,
    //     email: profile.has_email,
    //     nickname: profile.nickname,
    //     provider: 'kakao',
    //   });
    //   return newUser;
    // }
    // return exUser;
    return true;
  }

  async logIn(user, res) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user.id),
      this.generateRefreshToken(user.id),
    ]);

    res.cookie('refresh_token', refreshToken, {
      path: '/auth',
      httpOnly: true,
    });

    return { accessToken };
  }

  async generateAccessToken(user) {
    return this.jwtService.signAsync(
      { user },
      {
        expiresIn: '1m',
        subject: 'ACCESS_TOKEN',
      },
    );
  }

  async generateRefreshToken(user) {
    return this.jwtService.signAsync(
      { user },
      {
        expiresIn: '30 days',
        subject: 'REFRESH_TOKEN',
      },
    );
  }
}
