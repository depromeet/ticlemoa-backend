import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    const user = await this.userRepository.updateUser(userId, updateUserDto);
    return user;
  }

  async findOneByIdOrFail(userId: number): Promise<ResponseUserDto | never> {
    try {
      return await this.userRepository.findOneOrFail({ where: { id: userId } });
    } catch {
      throw new BadRequestException('존재하지 않는 유저입니다.');
    }
  }
}
