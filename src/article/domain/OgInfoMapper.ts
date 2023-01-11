import { OgInfoResponseDto } from '../dto/response-oginfo.dto';

export class OgInfoMapper {
  static toResponseDto(ogInfo): OgInfoResponseDto {
    return new OgInfoResponseDto({ ...ogInfo });
  }
}
