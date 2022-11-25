import { PickType } from '@nestjs/mapped-types';
import { User } from '../../entities/user.entity';

export class ValidateUserDto extends PickType(User, ['sns_id', 'email', 'nickname', 'provider'] as const) {}
