import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('/')
  @ApiExcludeEndpoint()
  @ApiTags('health check')
  healthCheck(): string {
    return 'ok';
  }
}
