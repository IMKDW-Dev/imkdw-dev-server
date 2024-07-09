export interface CreateCommentDto {
  content: string;
  articleId: string;
  parentId: number | null;
  userId: string;
}
