import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { UserPayload } from 'src/auth/types/jwt-payload.interface';
import { UserRequest } from '../common/decorators/user-request.decorator';
import { PaginationRequestDto } from './dto/pagination/pagination-request.dto';
import { CreateTagRequestDto } from './dto/request/create-tag-request.dto';
import { UpdateTagRequestDto } from './dto/request/update-tag-request.dto';
import { ManyTagsResponseDto, OneTagResponseDto } from './dto/response/response-tag.dto';
import { TagDtoMapper } from './dto/tag.mapper';
import { TagService } from './tag.service';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @Auth()
  @ApiOperation({ description: '태그를 생성합니다.' })
  @ApiCreatedResponse({ description: '태그 생성에 성공했습니다.', type: OneTagResponseDto })
  @ApiBadRequestResponse({ description: '이미 존재하는 태그입니다.' })
  async create(
    @UserRequest() { userId }: UserPayload,
    @Body() createTagRequest: CreateTagRequestDto,
  ): Promise<OneTagResponseDto> {
    const tag = await this.tagService.create(userId, createTagRequest);

    return TagDtoMapper.toResponseDto({ tag, userId });
  }

  @Get()
  @Auth()
  @ApiOperation({ description: '모든 태그를 조회합니다. 쿼리에 값을 넣어 페이지네이션도 할 수 있습니다.' })
  @ApiOkResponse({ description: '조회에 성공하여 태그 오브젝트를 배열로 반환합니다.', type: ManyTagsResponseDto })
  async findAll(
    @UserRequest() { userId }: UserPayload,
    @Query() { ...paginationRequestDto }: PaginationRequestDto,
  ): Promise<ManyTagsResponseDto> {
    const tags = await this.tagService.findAll(userId, paginationRequestDto);

    return TagDtoMapper.toResponseDtoList({ tags, userId });
  }

  @Patch(':tagId')
  @Auth()
  @ApiOkResponse({ description: '태그 수정에 성공했습니다.', type: OneTagResponseDto })
  @ApiNotFoundResponse({ description: '요청에 맞는 태그가 존재하지 않습니다.' })
  @ApiParam({ name: 'tagId', description: '태그의 id를 사용하여 업데이트 합니다.', example: 1 })
  async update(
    @UserRequest() { userId }: UserPayload,
    @Param('tagId', ParseIntPipe) tagId: number,
    @Body() updateTagRequestDto: UpdateTagRequestDto,
  ): Promise<OneTagResponseDto> {
    const tag = await this.tagService.update(userId, tagId, updateTagRequestDto);

    return TagDtoMapper.toResponseDto({ tag, userId });
  }

  @Delete(':tagId')
  @Auth()
  @ApiOkResponse({ description: '태그 삭제에 성공했습니다.' })
  @ApiNotFoundResponse({ description: '요청에 맞는 태그가 존재하지 않습니다.' })
  @ApiParam({ name: 'tagId', description: '태그의 id를 사용하여 삭제 합니다.', example: 1 })
  async remove(@UserRequest() { userId }: UserPayload, @Param('tagId', ParseIntPipe) tagId: number): Promise<void> {
    await this.tagService.remove(userId, tagId);
  }
}
