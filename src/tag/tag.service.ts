import { Injectable } from '@nestjs/common';
import { Tag } from '../entities/tag.entity';
import { PaginationRequestDto } from './dto/pagination/pagination-request.dto';
import { CreateTagRequestDto } from './dto/request/create-tag-request.dto';
import { UpdateTagRequestDto } from './dto/request/update-tag-request.dto';
import { TagRepository } from './repository/tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async createTag(userId: number, createTagRequestDto: CreateTagRequestDto): Promise<Tag> {
    return await this.tagRepository.createOne(userId, createTagRequestDto);
  }

  async findAllTags(userId: number, paginationRequestDto: PaginationRequestDto): Promise<Tag[]> {
    return await this.tagRepository.findAll(userId, paginationRequestDto);
  }

  async updateTag(userId: number, tagId: number, updateTagRequestDto: UpdateTagRequestDto) {
    const { tagName } = updateTagRequestDto;
    const updatedTag = await this.tagRepository.update({ userId, id: tagId }, { tagName });
    return updatedTag.affected === 1;
  }
}
