import { Injectable } from '@nestjs/common';
import { Article } from 'src/entities/article.entity';
import { ArticleTag } from 'src/entities/articleTag.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ArticleTagRepository extends Repository<ArticleTag> {
  constructor(private readonly dataSource: DataSource) {
    super(Article, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }
}
