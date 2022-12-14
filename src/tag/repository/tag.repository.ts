import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../../entities/tag.entity';
import { PaginationRequestDto } from '../dto/pagination/pagination-request.dto';
import { CreateTagRequestDto } from '../dto/request/create-tag-request.dto';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {
    super(tagRepository.target, tagRepository.manager, tagRepository.queryRunner);
  }

  async createOne(userId: number, createTagRequestDto: CreateTagRequestDto): Promise<Tag> {
    const { tagName } = createTagRequestDto;
    const existedTag: Tag = await this.findOne({ where: { tagName, userId } });
    if (existedTag) {
      throw new BadRequestException({
        message: '이미 존재하는 태그입니다.',
      });
    }
    return await this.save({ userId, tagName });
  }

  async findAll(userId: number, paginationRequestDto: PaginationRequestDto): Promise<Tag[]> {
    const { page, take } = paginationRequestDto;
    const query = this.createQueryBuilder('tag').where('tag.user_id = :userId', { userId });
    if (page && take) {
      query.take(take).skip(take * (page - 1));
    }
    return query.getMany();
  }
}
