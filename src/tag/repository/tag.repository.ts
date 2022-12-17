import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../../entities/tag.entity';
import { CreateTagRequestDto } from '../dto/request/request-tag.dto';
import { OneTagResponseDto } from '../dto/response/response-tag.dto';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {
    super(tagRepository.target, tagRepository.manager, tagRepository.queryRunner);
  }

  async createOneTag(userId: number, createTagRequestDto: CreateTagRequestDto): Promise<Tag> {
    const { tagName } = createTagRequestDto;
    const existedTag: Tag = await this.findOne({ where: { tagName, userId } });
    if (existedTag) {
      throw new BadRequestException({
        message: '이미 존재하는 태그입니다.',
      });
    }
    return await this.save({ userId, tagName });
  }

  async findAllTags(userId: number, paginationRequestDto: PaginationRequestDto): Promise<OneTagResponseDto[]> {
    const { page, take } = paginationRequestDto;
    return this.find({ where: { userId }, take, skip: take * (page - 1), order: { createdAt: 'desc' } });
}
