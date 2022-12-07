import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AuthProvider } from './types/auth-provider.interface';

@Entity()
export class User {
  @IsNumber()
  @IsNotEmpty()
  @PrimaryGeneratedColumn()
  id!: number;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  snsId!: string;

  @IsEmail()
  @Column({ type: 'varchar', length: 100 })
  email?: string | null;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  nickname!: string;

  @IsString()
  @Column({ type: 'varchar' })
  avatarUrl?: string | null;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'enum', enum: AuthProvider, nullable: false })
  provider!: AuthProvider;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date | null;
}
