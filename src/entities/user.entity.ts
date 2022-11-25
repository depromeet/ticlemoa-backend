import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AuthProvider } from './types/auth-provider.interface';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 43, nullable: false })
  sns_id!: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 40, nullable: false })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 20, nullable: false })
  nickname!: string;

  @Column({ type: 'varchar', nullable: true })
  avatar_url?: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'enum', enum: AuthProvider, nullable: false })
  provider!: AuthProvider;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at?: Date;
}
