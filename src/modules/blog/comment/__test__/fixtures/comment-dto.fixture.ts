import { generateCUID } from '../../../../../common/utils/cuid';
import { CreateCommentDto } from '../../dto/internal/create-comment.dto';

interface CreateCreateCommentDtoParams extends Partial<CreateCommentDto> {
  userId: string;
  articleId: string;
}
// eslint-disable-next-line import/prefer-default-export
export const createCreateCommentDto = (params: CreateCreateCommentDtoParams): CreateCommentDto => {
  return {
    userId: params.userId,
    articleId: params.articleId,
    content: params?.content ?? generateCUID(),
    parentId: params?.parentId ?? null,
  };
};
