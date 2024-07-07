import { InjectionToken } from '@nestjs/common';
import { GenerateThumbnailDto } from '../dto/internal/generate-thumbnail.dto';

export const IMAGE_SERVICE = Symbol('IMAGE_SERVICE');
export interface IImageService {
  generateThumbnail(dto: GenerateThumbnailDto): Promise<Buffer>;
}
