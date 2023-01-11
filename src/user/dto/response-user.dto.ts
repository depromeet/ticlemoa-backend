import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty({ nullable: true })
  email?: string;

  @ApiProperty({ nullable: true })
  nickname?: string;

  @ApiProperty({ nullable: true })
  avatarUrl?: string;
}
