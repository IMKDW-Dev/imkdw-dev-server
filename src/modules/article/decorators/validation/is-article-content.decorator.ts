import { registerDecorator, ValidationOptions } from 'class-validator';

export default function IsArticleContent(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsArticleContent',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(content: string) {
          /**
           * * 게시글 내용 유효성 규칙
           * 1. 2~65000자 까지 작성이 가능하다
           */
          if (!content) return false;
          const contentRegex = /^.{2,65000}$/;
          return contentRegex.test(content);
        },
      },
    });
  };
}
