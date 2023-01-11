import { Module } from '@nestjs/common';
import { BlacklistModule } from 'src/blacklist/blacklist.module';
import { TagModule } from 'src/tag/tag.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { OpenSearchService } from './opensearch/opensearch.service';
import { ArticleRepository } from './repository/article.repository';
import { ArticleTagRepository } from './repository/articleTag.repository';

@Module({
  imports: [BlacklistModule, TagModule],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository, ArticleTagRepository, OpenSearchService],
})
export class ArticleModule {}
