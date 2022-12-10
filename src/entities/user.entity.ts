import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AuthProvider } from './types/auth-provider.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  snsId!: string;

  @Column({ type: 'varchar', length: 100 })
  email?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nickname!: string;

  @Column({ type: 'varchar' })
  avatarUrl?: string | null;

  @Column({ type: 'enum', enum: AuthProvider, nullable: false })
  provider!: AuthProvider;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date | null;
}
