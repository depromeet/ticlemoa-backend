import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';

export class ResponseUserDto {
  @ApiProperty({ nullable: true })
  nickname?: string;

  constructor(user: User) {
    this.nickname = user.nickname;
  }
}
