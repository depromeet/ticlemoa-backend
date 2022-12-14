import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Article } from './article.entity';
import { Common } from './common.entity';
import { Tag } from './tag.entity';

@Entity()
export class ArticleTag extends Common {
  @Column()
  articleId: number;

  @Column()
  tagId: number;

  @ManyToOne(() => Article, (article) => article.articleTags)
  @JoinColumn([{ name: 'article_id', referencedColumnName: 'id' }])
  article: Article;

  @ManyToOne(() => Tag, (tag) => tag.articleTags)
  @JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }])
  tag: Tag;
}
