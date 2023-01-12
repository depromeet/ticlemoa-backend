import { Injectable } from '@nestjs/common';
import { Article } from 'src/entities/article.entity';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class ArticleRepository extends Repository<Article> {
  constructor(private readonly dataSource: DataSource) {
    super(Article, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }

  async findByArticleIds(articleIds: number[]) {
    const temp = await this.find({
      where: {
        id: In(articleIds),
      },
      relations: {
        articleTags: true,
      },
    });
    return temp;
  }

  async findByUserIdAndTag(userId: number, isPublic: string, tagId?: string): Promise<Article[]> {
    const queryBuilder = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.articleTags', 'articleTags')
      .where('article.userId =:userId', { userId });
    switch (isPublic) {
      case 'all':
        break;
      case 'true':
        queryBuilder.andWhere('article.isPublic =:isPublic', { isPublic: true });
        break;
      case 'false':
        queryBuilder.andWhere('article.isPublic =:isPublic', { isPublic: false });
        break;
    }
    if (tagId !== undefined) {
      queryBuilder.andWhere('articleTags.tagId =:tagId', { tagId });
    }
    return await queryBuilder.getMany();
  }
}
