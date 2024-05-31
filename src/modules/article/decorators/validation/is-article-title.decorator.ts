import { registerDecorator, ValidationOptions } from 'class-validator';

export default function IsArticleTitle(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsArticleTitle',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(title: string) {
          /**
           * * 게시글 제목 유효성 규칙
           * 1. 1~255자까지 허용된다
           */
          if (!title) return false;
          const titleRegex = /^.{1,255}$/;
          return titleRegex.test(title);
        },
      },
    });
  };
}
