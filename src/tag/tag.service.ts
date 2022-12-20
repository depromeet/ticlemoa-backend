import { Injectable, NotFoundException } from '@nestjs/common';
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

  async updateTag(userId: number, tagId: number, updateTagRequestDto: UpdateTagRequestDto): Promise<Tag> {
    const { tagName } = updateTagRequestDto;
    const updatedTag: Tag = await this.tagRepository.findOne({ where: { userId, id: tagId } });
    if (!updatedTag) {
      throw new NotFoundException({
        message: '요청한 태그가 존재하지 않습니다.',
      });
    }
    await this.tagRepository.update({ userId, id: tagId }, { tagName });
    updatedTag.tagName = tagName;
    return updatedTag;
  }
}
