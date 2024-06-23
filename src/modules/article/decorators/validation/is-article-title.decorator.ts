import { registerDecorator, ValidationOptions } from 'class-validator';
import { BAD_REQUEST_EXCEPTIONS } from '../../../../common/exceptions/400';

export default function IsArticleTitle(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsArticleTitle',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: { ...validationOptions, message: BAD_REQUEST_EXCEPTIONS.INVALID_ARTICLE_TITLE },
      validator: {
        validate(title: string) {
          /**
           * * 게시글 제목 유효성 규칙
           * 1. 10~255자까지 허용된다
           */
          if (!title) return false;
          const titleRegex = /^.{10,255}$/;
          return titleRegex.test(title);
        },
      },
    });
  };
}
