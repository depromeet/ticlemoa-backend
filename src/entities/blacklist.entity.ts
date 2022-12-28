import { Common } from './common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Blacklist extends Common {
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.blacklists)
  @JoinColumn()
  user: User;

  @Column()
  targetId: number;
}
