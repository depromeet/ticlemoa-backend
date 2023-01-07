import { IsNotEmpty, IsString } from 'class-validator';

export class WithdrawRequestDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
