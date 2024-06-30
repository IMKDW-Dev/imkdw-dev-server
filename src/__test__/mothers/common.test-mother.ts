import { faker } from '@faker-js/faker';

// eslint-disable-next-line import/prefer-default-export
export const generateMulterFile = (): Express.Multer.File => ({
  fieldname: 'thumbnail',
  originalname: faker.system.fileName(),
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('mock file content'),
  size: 1024,
  destination: '/tmp/uploads',
  filename: 'image.jpg',
  path: '/tmp/uploads/mockfile.jpg',
  stream: null,
});
