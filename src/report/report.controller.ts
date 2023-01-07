import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';
import { UserRequest } from 'src/common/decorators/user-request.decorator';
import { UserPayload } from 'src/auth/types/jwt-payload.interface';
import { Auth } from 'src/auth/decorator/auth.decorator';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Auth()
  @Post()
  @ApiOperation({ summary: '신고하기' })
  @ApiCreatedResponse({ description: '신고 성공' })
  @ApiBadRequestResponse({ description: '신고 실패' })
  async create(@UserRequest() { userId }: UserPayload, @Body() createReportDto: CreateReportDto) {
    return await this.reportService.create(userId, createReportDto);
  }
}
