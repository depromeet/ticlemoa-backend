import { Common } from './common.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Article } from './article.entity';
import { User } from './user.entity';

@Entity()
export class Blacklist extends Common {
  @Column({ type: 'varchar', length: 400 })
  content!: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.blacklists)
  @JoinColumn()
  user: User;

  @Column()
  targetId: number;
}
