import { Article } from 'src/entities/article.entity';
import { Tag } from 'src/entities/tag.entity';

export class CreateOpensearchArticleDto {
  id: number;
  url: string;
  title: string;
  content: string;
  tags: string[];
  tagIds: number[];
  isPublic: boolean;

  constructor(article: Article, tags: Tag[]) {
    this.id = article.id;
    this.url = article.url;
    this.title = article.title;
    this.content = this.content;
    this.tags = tags.map((tag) => tag.tagName);
    this.tagIds = tags.map((tag) => tag.id);
    this.isPublic = article.isPublic;
  }
}
