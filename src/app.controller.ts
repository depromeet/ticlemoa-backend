import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('/')
  @ApiTags('health check')
  healthCheck(): string {
    return 'ok';
  }
}
