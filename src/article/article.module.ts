import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleRepository } from './repository/article.repository';
import { ArticleTagRepository } from './repository/articleTag.repository';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository, ArticleTagRepository],
})
export class ArticleModule {}
