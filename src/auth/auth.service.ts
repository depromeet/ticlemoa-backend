import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ValidateUserDto } from './dto/validate-user.dto';
import { AuthProvider } from '../entities/types/auth-provider.interface';
import { User } from '../entities/user.entity';
import { UserRepository } from '../user/repository/user.repository';
import { JwtSubjectType } from './types/jwt.type';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly userRepository: UserRepository) {}

  async validateUser(validateUserDto: ValidateUserDto): Promise<User> {
    const { sns_id, email, nickname, provider } = validateUserDto;
    const exUser = await this.userRepository.findOne({
      where: { sns_id },
      select: { id: true, email: true, nickname: true, provider: true },
    });
    if (!exUser) {
      const newUser = await this.userRepository.save({
        sns_id,
        email,
        nickname,
        provider: AuthProvider[provider],
      });
      console.log(newUser);
      return newUser;
    }
    return exUser;
  }

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
