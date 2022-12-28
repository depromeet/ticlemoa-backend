import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { mySqlOptions } from './ormconfig';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { BlacklistModule } from './blacklist/blacklist.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(mySqlOptions),
    AuthModule,
    ArticleModule,
    BlacklistModule,
    TagModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
