import ArticleCommentDto from '../../article-comment.dto';

export interface CreateCommentDto extends Pick<ArticleCommentDto, 'content'> {
  articleId: string;
  parentId: number | null;
  userId: string;
}
