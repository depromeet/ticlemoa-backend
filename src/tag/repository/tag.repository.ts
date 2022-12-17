import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Tag } from '../../entities/tag.entity';
import { CreateTagDto } from '../dto/create-tag.dto';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    private readonly dataSource: DataSource,
  ) {
    super(tagRepository.target, tagRepository.manager, tagRepository.queryRunner);
  }

  async createOneTag(createTagDto: CreateTagDto): Promise<Tag> {
    const { userId, tagName } = createTagDto;
    const existedTag: Tag = await this.findOne({ where: { tagName, userId } });
    if (existedTag) {
      throw new BadRequestException({
        message: '이미 존재하는 태그입니다.',
      });
    }
    return await this.save(createTagDto);
  }
}
