import { generateMulterFile } from '../../../../../__test__/fixtures/create-multer-file.fixture';
import { generateCUID } from '../../../../../common/utils/cuid';
import { userRoles } from '../../../../user/domain/models/user-role.model';
import { CreateArticleDto } from '../../dto/internal/create-article.dto';
import { GetArticlesDto } from '../../dto/internal/get-article.dto';
import { UpdateArticleDto } from '../../dto/internal/update-article.dto';
import RequestCreateArticleDto from '../../dto/request/create-article.dto';
import { GetArticleSort } from '../../enums/article.enum';

export const createCreateArticleDto = (params?: Partial<CreateArticleDto>): CreateArticleDto => {
  return {
    title: params?.title ?? 'a'.repeat(10),
    visible: params?.visible ?? true,
    id: params?.id ?? 'a'.repeat(24),
    categoryId: params?.categoryId ?? 1,
    content: params?.content ?? 'a'.repeat(100),
    thumbnail: params?.thumbnail ?? generateMulterFile(),
    tags: params?.tags ?? ['tag1'],
    images: params?.images ?? [],
  };
};

export const createUpdateArticleDto = (params?: Partial<UpdateArticleDto>): UpdateArticleDto => {
  return {
    title: params?.title ?? 'a'.repeat(10),
    articleId: params?.articleId ?? 'a'.repeat(24),
    categoryId: params?.categoryId ?? 1,
    content: params?.content ?? 'a'.repeat(100),
    visible: params?.visible ?? true,
    thumbnail: params?.thumbnail ?? generateMulterFile(),
    images: params?.images ?? [],
  };
};

export const createGetArticlesDto = (params?: Partial<GetArticlesDto>): GetArticlesDto => {
  return {
    userRole: params?.userRole ?? userRoles.normal.name,
    limit: params?.limit ?? 10,
    page: params?.page ?? 1,
    categoryId: params?.categoryId ?? null,
    excludeId: params?.excludeId ?? '',
    search: params?.search ?? '',
    sort: params?.sort ?? GetArticleSort.LATEST,
  };
};

export const createRequestCreateArticleDto = (params?: Partial<RequestCreateArticleDto>): RequestCreateArticleDto => {
  return {
    id: params?.id ?? generateCUID(),
    title: params?.title ?? generateCUID(),
    visible: params?.visible ?? true,
    categoryId: params?.categoryId ?? 1,
    content: params?.content ?? 'a'.repeat(100),
    thumbnail: params?.thumbnail ?? generateMulterFile(),
    tags: params?.tags ?? ['tag1'],
    images: params?.images ?? [],
  };
};
