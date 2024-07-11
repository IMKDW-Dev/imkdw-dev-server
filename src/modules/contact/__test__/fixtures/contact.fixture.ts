import Contact from '../../domain/models/contact.model';

interface CreateContactParams {
  id?: number;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}
// eslint-disable-next-line import/prefer-default-export
export const createContact = (params: CreateContactParams): Contact => {
  return new Contact.builder()
    .setId(params?.id ?? 1)
    .setName(params?.name ?? 'name')
    .setEmail(params?.email ?? 'email')
    .setSubject(params?.subject ?? 'subject')
    .setMessage(params?.message ?? 'message')
    .build();
};
