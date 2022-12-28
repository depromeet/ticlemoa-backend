import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistController } from './blacklist.controller';
import { BlacklistService } from './blacklist.service';
import { BlacklistRepository } from './repository/blacklist.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlacklistRepository])],
  controllers: [BlacklistController],
  providers: [BlacklistService],
})
export class BlacklistModule {}
