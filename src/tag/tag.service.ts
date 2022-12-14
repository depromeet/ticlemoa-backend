import { Injectable } from '@nestjs/common';
import { CreateTagRequest } from './dto/request-tag.dto';
import { OneTagResponseDto } from './dto/response-tag.dto';
import { TagRepository } from './repository/tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async createTag(userId: number, createTagDto: CreateTagRequest): Promise<OneTagResponseDto> {
    return await this.tagRepository.createOneTag({ userId, tagName: createTagDto.tagName });
  }
}
