import { Injectable } from '@nestjs/common';
import { Tag } from '../entities/tag.entity';
import { CreateTagRequestDto } from './dto/request/request-tag.dto';
import { OneTagResponseDto } from './dto/response/response-tag.dto';
import { TagRepository } from './repository/tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async createTag(userId: number, createTagRequestDto: CreateTagRequestDto): Promise<Tag> {
    return await this.tagRepository.createOneTag(userId, createTagRequestDto);
  }

  async findAllTags(userId: number, paginationRequestDto: PaginationRequestDto): Promise<OneTagResponseDto[]> {
    return await this.tagRepository.findAllTags(userId, paginationRequestDto);
  }
}
