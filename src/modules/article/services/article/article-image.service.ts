import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IImageService, IMAGE_SERVICE } from '../../../../infra/image/interfaces/image.interface';
import { IStorageService, STORAGE_SERVICE } from '../../../../infra/storage/interfaces/storage.interface';
import ContentType from '../../../../infra/storage/enums/s3-content-type.enum';
import { generateUUID } from '../../../../common/utils/uuid';
import ArticleId from '../../domain/value-objects/article-id.vo';

@Injectable()
export default class ArticleImageService {
  private readonly THUMBNAIL_WIDTH = 300;

  constructor(
    @Inject(IMAGE_SERVICE) private readonly imageService: IImageService,
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
    private readonly configService: ConfigService,
  ) {}

  async getThumbnail(articleId: ArticleId, image: Express.Multer.File): Promise<string> {
    const BASIC_PATH = `articles/${articleId.toString()}`;

    const originalPath = `${BASIC_PATH}/thumbnail/original.${image.originalname.split('.').pop()}`;
    this.storageService.upload(originalPath, image.buffer, ContentType.IMAGE);

    const thumbnailPath = `${BASIC_PATH}/thumbnail/${generateUUID()}.webp`;
    const thumbnailImage: Buffer = await this.imageService.generateThumbnail({ image, width: this.THUMBNAIL_WIDTH });
    return this.storageService.upload(thumbnailPath, thumbnailImage, ContentType.IMAGE);
  }

  async copyContentImages(articleId: ArticleId, images: string[]) {
    const copyImagePromises = images.map(async (image) => {
      const fromPath = `${this.configService.get<string>('S3_PRESIGNED_BUCKET_NAME')}/${image}`;
      const toPath = `articles/${articleId.toString()}/content-images/${image}`;
      this.storageService.copyFile(fromPath, toPath);
      return {
        fromPath: `${this.configService.get<string>('S3_PRESIGNED_BUCKET_URL')}/${image}`,
        toPath: `${this.configService.get<string>('S3_BUCKET_URL')}/${toPath}`,
      };
    });

    return Promise.all(copyImagePromises);
  }
}
