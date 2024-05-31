import { registerDecorator, ValidationOptions } from 'class-validator';

export default function IsArticleId(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsArticleId',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(articleId: string) {
          /**
           * * 게시글 아이디 유효성 규칙
           * 1. 공백이 있으면 안된다.
           * 2. 1~245자까지 허용된다
           */

          if (!articleId) return false;
          const articleIdRegex = /^[^\s]{1,245}$/;
          return articleIdRegex.test(articleId);
        },
      },
    });
  };
}
