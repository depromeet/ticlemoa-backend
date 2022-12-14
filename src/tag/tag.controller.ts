import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/utils/guards/jwt-auth.guard';
import { UserRequest } from '../common/decorators/user-request.decorator';
import { User } from '../entities/user.entity';
import { CreateTagRequest } from './dto/request-tag.dto';
import { OneTagResponseDto } from './dto/response-tag.dto';
import { TagService } from './tag.service';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '태그를 생성합니다.' })
  @ApiCreatedResponse({ description: '태그 생성에 성공했습니다.', type: OneTagResponseDto })
  async createTag(@UserRequest() user: User, @Body() createTagRequest: CreateTagRequest): Promise<OneTagResponseDto> {
    return this.tagService.createTag(user.id, createTagRequest);
  }
}
