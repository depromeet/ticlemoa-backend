import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/utils/guards/jwt-auth.guard';
import { UserRequest } from '../common/decorators/user-request.decorator';
import { User } from '../entities/user.entity';
import { TagDtoMapper } from './dto/tag.mapper';
import { PaginationRequestDto } from './dto/pagination/pagination-request.dto';
import { CreateTagRequestDto } from './dto/request/create-tag-request.dto';
import { ManyTagsResponseDto, OneTagResponseDto } from './dto/response/response-tag.dto';
import { TagService } from './tag.service';
import { UpdateTagRequestDto } from './dto/request/update-tag-request.dto';

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
  @ApiOperation({ description: '모든 태그를 조회합니다. 쿼리에 값을 넣어 페이지네이션도 할 수 있습니다.' })
  @ApiOkResponse({ description: '조회에 성공하여 태그 오브젝트를 배열로 반환합니다.', type: ManyTagsResponseDto })
  async findAllTags(
    @UserRequest() user: User,
    @Query() { ...paginationRequestDto }: PaginationRequestDto,
  ): Promise<ManyTagsResponseDto> {
    const tags = await this.tagService.findAllTags(user.id, paginationRequestDto);

    return TagDtoMapper.toResponseDtoList({ tags, user });
  }

  @Patch(':tagId')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: '태그 수정에 성공했습니다.', type: OneTagResponseDto })
  @ApiNotFoundResponse({ description: '요청에 맞는 태그가 존재하지 않습니다.' })
  @ApiParam({ name: 'tagId', description: '태그의 id를 사용하여 업데이트 합니다.', example: 1 })
  async update(
    @UserRequest() user: User,
    @Param('tagId', ParseIntPipe) tagId: number,
    @Body() updateTagRequestDto: UpdateTagRequestDto,
  ): Promise<OneTagResponseDto> {
    const tag = await this.tagService.updateTag(user.id, tagId, updateTagRequestDto);

    return TagDtoMapper.toResponseDto({ tag, user });
  }
}
