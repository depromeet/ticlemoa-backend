import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlacklistDto } from './dto/create-blacklist.dto';
import { BlacklistRepository } from './repository/blacklist.repository';
import { ResponseBlacklistDto } from './dto/response-blacklist.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class BlacklistService {
  constructor(
    @InjectRepository(BlacklistRepository)
    private readonly blacklistRepository: BlacklistRepository,
  ) {}

  async create(user: User, createBlacklistDto: CreateBlacklistDto): Promise<ResponseBlacklistDto> {
    const blacklist = await this.blacklistRepository.createBlacklist(user, createBlacklistDto);
    return blacklist;
  }
}
