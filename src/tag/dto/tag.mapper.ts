import { Tag } from '../../entities/tag.entity';
import { ManyTagsResponseDto, OneTagResponseDto } from './response/response-tag.dto';

export class TagDtoMapper {
  static toResponseDto({ tag, userId }: { tag: Tag; userId: number }): OneTagResponseDto {
    return new OneTagResponseDto({
      userId,
      id: tag.id,
      tagName: tag.tagName,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    });
  }

  static toResponseDtoList({ tags, userId }: { tags: Tag[]; userId: number }): ManyTagsResponseDto {
    return { tags: tags.map((tag) => this.toResponseDto({ tag, userId })) };
  }
}
