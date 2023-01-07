import { Common } from './common.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Article } from './article.entity';
import { User } from './user.entity';

@Entity()
export class Report extends Common {
  @Column({ type: 'varchar', length: 400 })
  content!: string;

  @Column()
  @Index()
  userId!: number;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn()
  user: User;

  @Column()
  @Index()
  articleId!: number;

  @ManyToOne(() => Article, (article) => article.reports)
  @JoinColumn()
  article: Article;
}
