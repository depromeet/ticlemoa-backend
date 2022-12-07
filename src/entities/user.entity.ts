import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AuthProvider } from './types/auth-provider.interface';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  snsId!: string;

  @IsEmail()
  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  nickname!: string;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl?: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'enum', enum: AuthProvider, nullable: false })
  provider!: AuthProvider;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date;
}
