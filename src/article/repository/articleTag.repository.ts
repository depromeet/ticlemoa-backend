import { Injectable } from '@nestjs/common';
import { ArticleTag } from 'src/entities/articleTag.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ArticleTagRepository extends Repository<ArticleTag> {
  constructor(private readonly dataSource: DataSource) {
    super(ArticleTag, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }

  async deleteByArticleId(articleId: number) {
    await this.createQueryBuilder('articleTags')
      .delete()
      .from(ArticleTag)
      .andWhere('articleId =:articleId', { articleId })
      .execute();
  }
}
