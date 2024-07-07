import { registerDecorator, ValidationOptions } from 'class-validator';
import { BAD_REQUEST_EXCEPTIONS } from '../../../../common/exceptions/400';

export default function IsCommentContent(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsCommentContent',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: { ...validationOptions, message: BAD_REQUEST_EXCEPTIONS.INVALID_COMMENT_CONTENT },
      validator: {
        validate(content: string) {
          /**
           * 게시글 댓글 유효성 규칙
           * 1.2자 이상 255자 이하
           */
          return content.length >= 2 && content.length <= 255;
        },
      },
    });
  };
}
