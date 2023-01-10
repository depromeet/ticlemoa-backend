import { Injectable } from '@nestjs/common';
import { Article } from 'src/entities/article.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ArticleRepository extends Repository<Article> {
  constructor(private readonly dataSource: DataSource) {
    super(Article, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }

  async findByUserIdAndTag(userId: number, tagId?: string): Promise<Article[]> {
    const queryBuilder = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.articleTags', 'articleTags')
      .where('article.userId =:userId', { userId });
    if (tagId !== undefined) {
      queryBuilder.andWhere('articleTags.tagId =:tagId', { tagId });
    }
    return await queryBuilder.getMany();
  }
}
