import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportRepository } from './repository/report.repository';
import { CreateReportDto } from './dto/create-report.dto';
import { ResponseReportDto } from './dto/response.report.dto';

@Injectable()
export class ReportService {
  constructor(@InjectRepository(ReportRepository) private readonly reportRepository: ReportRepository) {}

  async create(userId: number, createReportDto: CreateReportDto): Promise<ResponseReportDto> {
    const report = await this.reportRepository.createReport(userId, createReportDto);
    return report;
  }
}
