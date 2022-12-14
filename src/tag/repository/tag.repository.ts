import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    super(Tag, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }

  async createNewTag(createTagDto: CreateTagDto): Promise<Tag> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existedTag: Tag = await this.findOne({ where: { tagName: createTagDto.tagName } });
      if (existedTag) {
        throw new BadRequestException({
          message: '이미 존재하는 태그입니다.',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      const createdTag: Tag = await this.save({ ...createTagDto });
      await queryRunner.commitTransaction();
      return createdTag;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
