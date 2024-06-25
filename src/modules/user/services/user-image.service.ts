import { Inject, Injectable } from '@nestjs/common';
import { IImageService, IMAGE_SERVICE } from '../../../infra/image/interfaces/image.interface';
import { IStorageService, STORAGE_SERVICE } from '../../../infra/storage/interfaces/storage.interface';
import User from '../domain/models/user.model';
import ContentType from '../../../infra/storage/enums/s3-content-type.enum';
import { generateUUID } from '../../../common/utils/uuid';

@Injectable()
export default class UserImageService {
  constructor(
    @Inject(IMAGE_SERVICE) private readonly imageService: IImageService,
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
  ) {}

  async getProfileImage(user: User, image: Express.Multer.File): Promise<string> {
    const BASIC_PATH = `users/${user.id}`;

    const originalPath = `${BASIC_PATH}/original.${image.originalname.split('.').pop()}`;
    this.storageService.upload(originalPath, image.buffer, ContentType.IMAGE);

    const thumbnailPath = `${BASIC_PATH}/${generateUUID()}.webp`;
    const thumbnailImage: Buffer = await this.imageService.generateThumbnail({ image, width: 60 });
    return this.storageService.upload(thumbnailPath, thumbnailImage, ContentType.IMAGE);
  }
}
