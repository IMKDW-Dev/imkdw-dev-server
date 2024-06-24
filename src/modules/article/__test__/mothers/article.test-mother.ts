import { faker } from '@faker-js/faker';
import { CreateArticleDto } from '../../dto/internal/article/create-article.dto';
import { generateMulterFile } from '../../../../__test__/mothers/common.test-mother';
import Article from '../../domain/entities/article.entity';
import ArticleId from '../../domain/value-objects/article-id.vo';
import Category from '../../../category/domain/entities/category.entity';
import ArticleContent from '../../domain/value-objects/article-content.vo';
import Tag from '../../../tag/domain/entities/tag.entity';

export const generateCreateArticleDto = (params?: Partial<CreateArticleDto>): CreateArticleDto => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraph(),
  categoryId: 1,
  tags: [faker.lorem.word()],
  thumbnail: generateMulterFile(),
  visible: true,
  images: [],
  ...params,
});

interface GenerateArticleParams {
  id: ArticleId;
  category: Category;
  content: ArticleContent;
  tags: Tag[];
}
export const generateArticle = (params: GenerateArticleParams): Article => {
  const article = Article.create({
    id: params.id,
    title: faker.lorem.sentence(),
    category: params.category,
    content: params.content,
    visible: true,
    thumbnail: faker.image.url(),
    viewCount: faker.number.int(),
    commentCount: faker.number.int(),
    createdAt: new Date(),
    tags: params.tags,
    ...params,
  });

  return article;
};

export const generateArticleId = (id?: string) => new ArticleId(id ?? faker.string.uuid());
export const generateArticleContent = (content?: string) => new ArticleContent(content ?? faker.lorem.paragraph());
