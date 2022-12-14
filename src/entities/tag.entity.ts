import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Common } from './common.entity';
import { User } from './user.entity';

@Entity()
export class Tag extends Common {
  @Column({ type: 'varchar', length: 50 })
  tagName!: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
