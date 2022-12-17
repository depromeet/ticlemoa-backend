import { Tag } from '../../entities/tag.entity';
import { User } from '../../entities/user.entity';
import { OneTagResponseDto } from './response/response-tag.dto';

export class TagDtoMapper {
  static toResponseDto({ tag, user }: { tag: Tag; user: User }): OneTagResponseDto {
    return new OneTagResponseDto({
      userId: user.id,
      id: tag.id,
      tagName: tag.tagName,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    });
  }

  static toResponseDtoList({ tags, user }: { tags: Tag[]; user: User }): OneTagResponseDto[] {
    return tags.map((tag) => this.toResponseDto({ tag, user }));
  }
}
