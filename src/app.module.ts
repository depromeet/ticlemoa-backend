import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { mySqlOptions } from './ormconfig';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, TypeOrmModule.forRoot(mySqlOptions)],
})
export class AppModule {}
