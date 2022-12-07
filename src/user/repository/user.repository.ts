import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    super(userRepository.target, userRepository.manager, userRepository.queryRunner);
  }

  async findBySnsId(snsId: string) {
    return await this.findOne({ where: { snsId } });
  }

  async createUser(userData: Partial<User>) {
    const createdUser = this.create(userData);
    await this.save(createdUser);
    return createdUser;
  }
}
