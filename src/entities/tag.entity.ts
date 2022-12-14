import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ArticleTag } from './articleTag.entity';
import { Common } from './common.entity';
import { User } from './user.entity';

@Entity()
export class Tag extends Common {
  @Column({ type: 'varchar', length: 50, unique: true })
  tagName!: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => ArticleTag, (articleTag) => articleTag.tag)
  articleTags: ArticleTag[];
}
