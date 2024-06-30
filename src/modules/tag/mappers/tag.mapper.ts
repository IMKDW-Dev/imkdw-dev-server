import { tags } from '@prisma/client';
import Tag from '../domain/models/tag.model';
import TagDto from '../dto/tag.dto';

export const toDto = (tag: Tag) => new TagDto(tag.getId(), tag.toString());

export const toModel = (tag: tags) => new Tag.builder().setId(tag.id).setName(tag.name).build();
