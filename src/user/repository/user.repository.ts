import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.nickname = updateUserDto.nickname;
    user.avatarUrl = updateUserDto.avatarUrl;
    return this.save(user);
  }
}
