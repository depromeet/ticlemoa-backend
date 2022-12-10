import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
@Injectable()
export class ParseIdsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): Array<number> {
    if (!/^\d+(,\d+)*$/.test(value)) {
      throw new BadRequestException('ids are not valid');
    }
    return value.split(',').map((id: string) => +id);
  }
}
