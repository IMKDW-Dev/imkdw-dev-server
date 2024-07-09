import { ClassProvider, Provider } from '@nestjs/common';
import CommentService from './services/comment.service';
import { COMMENT_REPOSITORY } from './repository/comment-repo.interface';
import CommentRepository from './infra/comment.repository';
import CommentController from './controllers/comment.controller';

const services: Provider[] = [CommentService];
const usecases: Provider[] = [];
const repositories: ClassProvider[] = [
  {
    provide: COMMENT_REPOSITORY,
    useClass: CommentRepository,
  },
];

export const commentControllers = [CommentController];
export const commentProviders = [...services, ...usecases, ...repositories];
