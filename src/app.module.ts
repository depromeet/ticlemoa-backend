import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { mySqlOptions } from './ormconfig';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, TypeOrmModule.forRoot(mySqlOptions), ArticleModule],
  controllers: [AppController],
})
export class AppModule {}
