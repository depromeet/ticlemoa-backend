import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    super(userRepository.target, userRepository.manager, userRepository.queryRunner);
  }

  async findOneBySnsId(snsId: string) {
    return await this.findOne({ where: { snsId } });
  }

  async createUser(createUserDto: CreateUserDto) {
    const createdUser = this.create(createUserDto);
    await this.save(createdUser);
    return createdUser;
  }
}
