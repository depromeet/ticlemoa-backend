import { Injectable } from '@nestjs/common';
import { Article } from 'src/entities/article.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ArticleRepository extends Repository<Article> {
  constructor(private readonly dataSource: DataSource) {
    super(Article, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }
}
