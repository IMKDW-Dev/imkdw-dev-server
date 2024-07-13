import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import { IImageService } from '../interfaces/image.interface';
import { GenerateThumbnailDto } from '../dto/internal/generate-thumbnail.dto';

@Injectable()
export default class ImageService implements IImageService {
  async generateThumbnail(dto: GenerateThumbnailDto): Promise<Buffer> {
    const thumbnail = await sharp(dto.image.buffer)
      .webp({ quality: dto?.quality ?? 40 })
      .resize({ width: dto.width })
      .toBuffer();

    return thumbnail;
  }
}
