import { registerDecorator, ValidationOptions } from 'class-validator';

export default function IsCommentContent(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsCommentContent',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(content: string) {
          /**
           * * 게시글 댓글 유효성 규칙
           * * 2자 이상 255자 이하
           */
          return content.length >= 2 && content.length <= 255;
        },
      },
    });
  };
}
