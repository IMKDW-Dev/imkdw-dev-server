import { registerDecorator, ValidationOptions } from 'class-validator';
import { BAD_REQUEST_EXCEPTIONS } from '../../../../common/exceptions/400';

export default function IsCategoryDesc(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsCategoryDesc',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: { ...validationOptions, message: BAD_REQUEST_EXCEPTIONS.INVALID_CATEGORY_DESC },
      validator: {
        validate(desc: string) {
          /**
           * * 카테고리 내용 유효성 규칙
           * 1. 공백이 있으면 안된다.
           * 2. 2~200자까지 허용된다
           */
          if (!desc) return false;
          const descRegex = /^.{2,200}$/;
          return descRegex.test(desc);
        },
      },
    });
  };
}
