import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ValidateUserDto } from './dto/validate-user.dto';
import { AuthProvider } from '../entities/types/auth-provider.interface';
import { User } from '../entities/user.entity';
import { UserRepository } from '../user/repository/user.repository';
import { JwtSubjectType } from './types/jwt.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async validateUser(validateUserDto: ValidateUserDto): Promise<User> {
    const { sns_id, email, nickname, provider } = validateUserDto;
    const exUser = await this.userRepository.findOne({
      where: { sns_id },
    });
    if (!exUser) {
      const newUser = await this.userRepository.save({
        sns_id,
        email,
        nickname,
        provider: AuthProvider[provider],
      });
      return newUser;
    }
    return exUser;
  }

  logIn(user: User, res: Response): { accessToken: string } {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    res.cookie('Authorization', accessToken, {
      httpOnly: true,
      maxAge: +this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME') * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') * 1000,
    });

    return { accessToken };
  }

  generateAccessToken(user: User): string {
    return this.jwtService.sign(
      { id: user.id, provider: user.provider },
      {
        subject: JwtSubjectType.ACCESS,
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
      },
    );
  }

  generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      { id: user.id, provider: user.provider },
      {
        subject: JwtSubjectType.REFRESH,
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
      },
    );
  }
}
