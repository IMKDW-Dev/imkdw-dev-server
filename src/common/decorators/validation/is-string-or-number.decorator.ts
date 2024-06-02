import { registerDecorator, ValidationOptions } from 'class-validator';

export default function IsNumberOrString(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsNumberOrString',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(content: unknown) {
          return typeof content === 'number' || typeof content === 'string';
        },
      },
    });
  };
}
