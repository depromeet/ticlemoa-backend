import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    const user = await this.userRepository.updateUser(userId, updateUserDto);
    return new ResponseUserDto(user);
  }

  async findOneByIdOrFail(userId: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException();
      }
      return user;
    } catch {
      throw new BadRequestException('존재하지 않는 유저입니다.');
    }
  }
}
