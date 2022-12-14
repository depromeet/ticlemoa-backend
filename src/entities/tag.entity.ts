import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ArticleTag } from './articleTag.entity';
import { Common } from './common.entity';
import { User } from './user.entity';

@Entity()
export class Tag extends Common {
  @ApiProperty({ example: '디프만', description: '태그 내용' })
  @Column({ type: 'varchar', length: 50, unique: true })
  tagName!: string;

  @ApiProperty({ example: 1, description: '유저 id' })
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => ArticleTag, (articleTag) => articleTag.tag)
  articleTags: ArticleTag[];
}
