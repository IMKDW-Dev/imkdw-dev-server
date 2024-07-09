import { registerDecorator, ValidationOptions } from 'class-validator';
import { BAD_REQUEST_EXCEPTIONS } from '../../../../../common/exceptions/400';

export default function IsTagName(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsTagName',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: { ...validationOptions, message: BAD_REQUEST_EXCEPTIONS.INVALID_TAG_NAME },
      validator: {
        validate(name: string) {
          /**
           * * 태그 이름 유효성 규칙
           * 1. 최소 2자 이상 20자 이하
           * 2. 공백을 포함할 수 없음
           */
          const regex = /^[^\s]{2,20}$/;
          return regex.test(name);
        },
      },
    });
  };
}
