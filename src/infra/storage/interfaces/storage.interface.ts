import ContentType from '../enums/s3-content-type.enum';

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');
export interface IStorageService {
  upload(filePath: string, file: Buffer, contentType: ContentType): Promise<string>;

  getUploadUrl(filename: string): Promise<string>;

  copyFile(fromPath: string, toPath: string): Promise<void>;
}
