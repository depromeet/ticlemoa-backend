import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlacklistDto } from './dto/create-blacklist.dto';
import { ResponseBlacklistDto } from './dto/response-blacklist.dto';
import { BlacklistRepository } from './repository/blacklist.repository';

@Injectable()
export class BlacklistService {
  constructor(
    @InjectRepository(BlacklistRepository)
    private readonly blacklistRepository: BlacklistRepository,
  ) {}

  async create(userId: number, createBlacklistDto: CreateBlacklistDto): Promise<ResponseBlacklistDto> {
    const blacklist = await this.blacklistRepository.createBlacklist(userId, createBlacklistDto);
    return blacklist;
  }
}
