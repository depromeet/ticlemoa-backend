import { Injectable } from '@nestjs/common';
import { Blacklist } from 'src/entities/blacklist.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateBlacklistDto } from '../dto/create-blacklist.dto';
import { ResponseBlacklistDto } from '../dto/response-blacklist.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class BlacklistRepository extends Repository<Blacklist> {
  constructor(private readonly dataSource: DataSource) {
    super(Blacklist, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }

  async createBlacklist(user: User, createBlacklistDto: CreateBlacklistDto): Promise<ResponseBlacklistDto> {
    const userId = user.id;
    const { targetId } = createBlacklistDto;
    return await this.save({ userId, targetId });
  }

  async findAllBlacklistByUserId(userId: number): Promise<ResponseBlacklistDto[]> {
    return await this.find({ where: { userId } });
  }
}
