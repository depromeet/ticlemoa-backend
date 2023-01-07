import { DataSource, Repository } from 'typeorm';
import { CreateReportDto } from '../dto/create-report.dto';
import { ResponseReportDto } from '../dto/response.report.dto';
import { Report } from 'src/entities/report.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportRepository extends Repository<Report> {
  constructor(private readonly dataSource: DataSource) {
    super(Report, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }

  async createReport(userId: number, createReportDto: CreateReportDto): Promise<ResponseReportDto> {
    const { articleId, content } = createReportDto;
    return await this.save({ userId, articleId, content });
  }

  async findAllReportByUserId(userId: number): Promise<ResponseReportDto[]> {
    return await this.find({ where: { userId } });
  }
}
