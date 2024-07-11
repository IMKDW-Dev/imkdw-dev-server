import { CreateContactDto } from '../../dto/internal/create-contact.dto';

// eslint-disable-next-line import/prefer-default-export
export const createCreateContactDto = (params?: Partial<CreateContactDto>): CreateContactDto => {
  return {
    name: params?.name ?? 'name',
    email: params?.email ?? 'email',
    subject: params?.subject ?? 'subject',
    message: params?.message ?? 'message',
  };
};
