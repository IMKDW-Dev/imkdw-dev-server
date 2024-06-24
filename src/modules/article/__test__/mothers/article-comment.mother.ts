import { faker } from '@faker-js/faker';
import ArticleComment from '../../domain/entities/article-comment.entity';

// eslint-disable-next-line import/prefer-default-export
export const generateArticleComment = (params: Partial<ArticleComment>) =>
  ArticleComment.create({
    id: faker.number.int(),
    content: faker.lorem.sentence(),
    articleId: faker.string.uuid(),
    ...params,
  });
