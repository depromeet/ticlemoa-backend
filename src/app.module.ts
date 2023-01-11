import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { mySqlOptions } from './ormconfig';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { BlacklistModule } from './blacklist/blacklist.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(mySqlOptions),
    AuthModule,
    ArticleModule,
    BlacklistModule,
    TagModule,
    ReportModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
