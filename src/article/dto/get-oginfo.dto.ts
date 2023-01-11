import { IsNotEmpty, IsUrl } from 'class-validator';

export class GetOgInfoDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
