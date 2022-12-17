import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/utils/guards/jwt-auth.guard';
import { UserRequest } from '../common/decorators/user-request.decorator';
import { User } from '../entities/user.entity';
import { TagDtoMapper } from './dto/tag.mapper';
import { PaginationRequestDto } from './dto/pagination/pagination-request.dto';
import { CreateTagRequestDto } from './dto/request/request-tag.dto';
import { OneTagResponseDto } from './dto/response/response-tag.dto';
import { TagService } from './tag.service';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '태그를 생성합니다.' })
  @ApiCreatedResponse({ description: '태그 생성에 성공했습니다.', type: OneTagResponseDto })
  @ApiBadRequestResponse({ description: '이미 존재하는 태그입니다.' })
  async createTag(
    @UserRequest() user: User,
    @Body() createTagRequest: CreateTagRequestDto,
  ): Promise<OneTagResponseDto> {
    const tag = await this.tagService.createTag(user.id, createTagRequest);

    return TagDtoMapper.toResponseDto({ tag, user });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllTags(
    @UserRequest() user: User,
    @Query() { ...paginationRequestDto }: PaginationRequestDto,
  ): Promise<OneTagResponseDto[]> {
    const tags = await this.tagService.findAllTags(user.id, paginationRequestDto);

    return TagDtoMapper.toResponseDtoList({ tags, user });
  }
}
