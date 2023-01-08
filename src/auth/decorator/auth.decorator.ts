import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';

export function Auth(guard = JwtAuthGuard) {
  return applyDecorators(UseGuards(guard), ApiBearerAuth('access-token'));
}
