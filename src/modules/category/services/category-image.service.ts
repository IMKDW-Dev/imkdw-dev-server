import { Inject, Injectable } from '@nestjs/common';
import Category from '../domain/entities/category.entity';
import { IImageService, IMAGE_SERVICE } from '../../../infra/image/interfaces/image.interface';
import { IStorageService, STORAGE_SERVICE } from '../../../infra/storage/interfaces/storage.interface';
import { generateUUID } from '../../../common/utils/uuid';
import ContentType from '../../../infra/storage/enums/s3-content-type.enum';

@Injectable()
export default class CategoryImageService {
  constructor(
    @Inject(IMAGE_SERVICE) private readonly imageService: IImageService,
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
  ) {}

  async getThumbnail(category: Category, image: Express.Multer.File): Promise<string> {
    const BASIC_PATH = `categories/${category.getId()}`;

    const originalPath = `${BASIC_PATH}/original.${image.originalname.split('.').pop()}`;
    this.storageService.upload(originalPath, image.buffer, ContentType.IMAGE);

    const thumbnailPath = `${BASIC_PATH}/${generateUUID()}.webp`;
    const thumbnailImage: Buffer = await this.imageService.generateThumbnail({ image, width: 100 });
    return this.storageService.upload(thumbnailPath, thumbnailImage, ContentType.IMAGE);
  }
}
