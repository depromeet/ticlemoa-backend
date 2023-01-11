import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportRepository } from './repository/report.repository';

@Module({
  controllers: [ReportController],
  providers: [ReportService, ReportRepository],
  exports: [],
})
export class ReportModule {}
