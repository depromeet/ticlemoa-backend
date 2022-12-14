import { Injectable } from '@nestjs/common';
import { Tag } from '../entities/tag.entity';
import { CreateTagRequest } from './dto/request-tag.dto';
import { TagRepository } from './repository/tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async createTag(userId: number, createTagDto: CreateTagRequest): Promise<Tag> {
    return await this.tagRepository.createNewTag({ userId, tagName: createTagDto.tagName });
  }
}
