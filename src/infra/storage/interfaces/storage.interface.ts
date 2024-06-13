import { InjectionToken } from '@nestjs/common';
import ContentType from '../enums/s3-content-type.enum';

export const STORAGE_SERVICE: InjectionToken = Symbol('STORAGE_SERVICE');
export interface IStorageService {
  upload(filePath: string, file: Buffer, contentType: ContentType): Promise<string>;

  getUploadUrl(filename: string): Promise<string>;
}
