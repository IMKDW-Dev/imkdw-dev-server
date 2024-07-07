import Category from '../../../../category/domain/models/category.model';
import Tag from '../../../../tag/domain/models/tag.model';
import Article from '../../../domain/models/article.model';
import ArticleContent from '../../../domain/vo/article/article-content.vo';
import ArticleId from '../../../domain/vo/article/article-id.vo';
import ArticleDto from '../../../dto/article.dto';

interface CreateArticleParams {
  id?: string;
  title?: string;
  category: Category;
  content?: string;
  visible?: boolean;
  thumbnail?: string;
  viewCount?: number;
  createdAt?: Date;
  tags?: Tag[];
}
// eslint-disable-next-line import/prefer-default-export
export const createArticle = (params?: CreateArticleParams) => {
  return new Article.builder()
    .setId(new ArticleId(params?.id ?? 'articleId'))
    .setTitle(params?.title ?? 'title')
    .setCategory(params?.category ?? new Category.builder().build())
    .setContent(new ArticleContent(params?.content ?? 'a'.repeat(100)))
    .setVisible(params?.visible ?? true)
    .setThumbnail(params?.thumbnail ?? 'thumbnail')
    .setViewCount(params?.viewCount ?? 1)
    .setCreatedAt(params?.createdAt ?? new Date())
    .setTags(params?.tags ?? [])
    .build();
};

export const createArticleDto = (params?: Partial<ArticleDto>): ArticleDto => {
  return {
    id: params.id,
    category: params.category,
    commentCount: params.commentCount,
    comments: params.comments,
    content: params.content,
    createdAt: params.createdAt,
    tags: params.tags,
    thumbnail: params.thumbnail,
    title: params.title,
    viewCount: params.viewCount,
    visible: params.visible,
  };
};
