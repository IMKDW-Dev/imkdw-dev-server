import path from 'path';
import fs from 'fs';

// eslint-disable-next-line import/prefer-default-export
export const generateMulterFile = (): Express.Multer.File => {
  const imagePath = path.join(__dirname, 'resources', 'image.png');
  const buffer = fs.readFileSync(imagePath);
  const filename = path.basename(imagePath);
  const { size } = fs.statSync(imagePath);
  const mimetype = `image/${path.extname(imagePath).slice(1)}`;

  return {
    fieldname: 'thumbnail',
    originalname: filename,
    encoding: '7bit',
    mimetype,
    buffer,
    size,
    destination: '/tmp/uploads',
    filename,
    path: imagePath,
    stream: null,
  };
};
