import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Tag } from '../../entities/tag.entity';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    private readonly dataSource: DataSource,
  ) {
    super(Tag, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }

  async createNewTag(tag: Partial<Tag>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existedTag = await this.findOne({ where: { tagName: tag.tagName } });
      if (existedTag) {
        throw new BadRequestException({
          message: '이미 존재하는 태그입니다.',
        });
      }
      const createdTag = this.create({ ...tag });
      await this.save(createdTag);
      await queryRunner.commitTransaction();
      return createdTag;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException({
        message: '태그 생성 과정에서 오류가 발생하였습니다.',
      });
    } finally {
      await queryRunner.release();
    }
  }
}
