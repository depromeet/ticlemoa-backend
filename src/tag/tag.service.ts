import { Injectable } from '@nestjs/common';
import { Tag } from '../entities/tag.entity';
import { CreateTagRequestDto } from './dto/request/request-tag.dto';
import { TagRepository } from './repository/tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async createTag(userId: number, createTagRequestDto: CreateTagRequestDto): Promise<Tag> {
    return await this.tagRepository.createOne(userId, createTagRequestDto);
  }
}
