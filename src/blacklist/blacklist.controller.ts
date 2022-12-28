import { Body, Controller, Post } from '@nestjs/common';
import { ResponseBlacklistDto } from './dto/response-blacklist.dto';
import { CreateBlacklistDto } from './dto/create-blacklist.dto';
import { BlacklistService } from './blacklist.service';
import { ApiTags } from '@nestjs/swagger';
import { UserRequest } from 'src/common/decorators/user-request.decorator';
import { User } from 'src/entities/user.entity';

@ApiTags('Blacklist')
@Controller('blacklist')
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Post()
  create(@UserRequest() user: User, @Body() createBlacklistDto: CreateBlacklistDto): Promise<ResponseBlacklistDto> {
    return this.blacklistService.create(user, createBlacklistDto);
  }
}
