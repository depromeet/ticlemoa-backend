import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagRepository } from './repository/tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async createTag(userId: number, createTagDto: CreateTagDto) {
    const { tagName } = createTagDto;
    const createdTag = await this.tagRepository.createNewTag({ userId, tagName });
    return createdTag;
  }
}
