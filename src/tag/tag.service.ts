import { Injectable, NotFoundException } from '@nestjs/common';
import { Tag } from '../entities/tag.entity';
import { PaginationRequestDto } from './dto/pagination/pagination-request.dto';
import { CreateTagRequestDto } from './dto/request/create-tag-request.dto';
import { UpdateTagRequestDto } from './dto/request/update-tag-request.dto';
import { TagRepository } from './repository/tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async create(userId: number, createTagRequestDto: CreateTagRequestDto): Promise<Tag> {
    return await this.tagRepository.createOne(userId, createTagRequestDto);
  }

  async findAll(userId: number, paginationRequestDto: PaginationRequestDto): Promise<Tag[]> {
    return await this.tagRepository.findAll(userId, paginationRequestDto);
  }

  async update(userId: number, tagId: number, updateTagRequestDto: UpdateTagRequestDto): Promise<Tag> {
    const { tagName } = updateTagRequestDto;
    const existedTag: Tag = await this.tagRepository.findOne({ where: { userId, id: tagId } });
    if (!existedTag) {
      throw new NotFoundException({
        message: '요청한 태그가 존재하지 않습니다.',
      });
    }
    await this.tagRepository.update({ userId, id: tagId }, { tagName });
    existedTag.tagName = tagName;
    return existedTag;
  }

  async remove(userId: number, tagId: number) {
    const existedTag: Tag = await this.tagRepository.findOne({ where: { userId, id: tagId } });
    if (!existedTag) {
      throw new NotFoundException({
        message: '요청한 태그가 존재하지 않습니다.',
      });
    }
    await this.tagRepository.softDelete({ userId, id: tagId });
  }
}
