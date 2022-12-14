import { Common } from './common.entity';
import { AuthProvider } from './types/auth-provider.enum';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Article } from './article.entity';
import { Tag } from './tag.entity';
import { Report } from './report.entity';
import { Blacklist } from './blacklist.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends Common {
  @Index()
  @Column({ type: 'varchar', length: 100 })
  snsId!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nickname?: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl?: string | null;

  @Column({ type: 'enum', enum: AuthProvider })
  provider!: AuthProvider;

  @Exclude()
  @Column({ type: 'varchar', length: 300, nullable: true })
  refreshToken?: string;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @OneToMany(() => Blacklist, (blacklist) => blacklist.user)
  blacklists: Blacklist[];
}
