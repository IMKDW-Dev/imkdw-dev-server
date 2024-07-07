import { registerDecorator, ValidationOptions } from 'class-validator';
import { BAD_REQUEST_EXCEPTIONS } from '../../../../common/exceptions/400';

export default function IsArticleId(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsArticleId',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: { ...validationOptions, message: BAD_REQUEST_EXCEPTIONS.INVALID_ARTICLE_ID },
      validator: {
        validate(articleId: string) {
          /**
           * 게시글 아이디 유효성 규칙
           * 1. 공백이 있으면 안된다.
           * 2. 10~245자까지 허용된다.
           * 3. 영문, 숫자, 특수문자만 포함한다.
           */
          if (!articleId) return false;
          const articleIdRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{10,245}$/;
          return articleIdRegex.test(articleId);
        },
      },
    });
  };
}
