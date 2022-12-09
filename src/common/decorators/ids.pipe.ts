import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

@Injectable()
export class RegexTest implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): Array<number> {
    if (!/^\d+(,\d+)*$/.test(value)) {
      throw new BadRequestException('ids are not valid');
    }
    return value.split(',').map((id: string) => +id);
  }
}
