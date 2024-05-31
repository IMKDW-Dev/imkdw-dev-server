import { registerDecorator, ValidationOptions } from 'class-validator';

export default function IsCategoryName(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsCategoryName',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(name: string) {
          /**
           * * 카테고리 이름 유효성 규칙
           * 1. 공백이 있으면 안된다.
           * 2. 2~20자까지 허용된다
           */
          if (!name) return false;
          const nameRegex = /^.{2,20}$/;
          return nameRegex.test(name);
        },
      },
    });
  };
}
