import { registerDecorator, ValidationOptions } from 'class-validator';
import { BAD_REQUEST_EXCEPTIONS } from '../../../../../common/exceptions/400';

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
          if (!desc) return false;
          const descRegex = /^.{10,200}$/;
          return descRegex.test(desc);
        },
      },
    });
  };
}
