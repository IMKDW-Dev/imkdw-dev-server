import { Injectable, Logger } from '@nestjs/common';
import { CopyObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

import { IStorageService } from '../interfaces/storage.interface';
import ContentType from '../enums/s3-content-type.enum';

@Injectable()
export default class AwsS3Service implements IStorageService {
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_IAM_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_IAM_SECRET_ACCESS_KEY'),
      },
    });
  }

  async upload(filePath: string, file: Buffer, contentType: ContentType) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
      Key: filePath,
      Body: file,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    const bucketUrl = this.configService.get<string>('S3_BUCKET_URL');
    return `${bucketUrl}/${filePath}`;
  }

  async getUploadUrl(filename: string): Promise<string> {
    const URL_EXPIRE = this.configService.get('S3_PRESIGNED_URL_EXPIRES_IN');

    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('S3_PRESIGNED_BUCKET_NAME'),
      Key: filename,
    });
    const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: URL_EXPIRE });

    return presignedUrl;
  }

  async copyFile(fromPath: string, toPath: string): Promise<void> {
    const command = new CopyObjectCommand({
      CopySource: fromPath,
      Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
      Key: toPath,
    });

    try {
      await this.s3Client.send(command);
    } catch (err) {
      Logger.error(err.message, err.stack, 'AwsS3Service.copyFile');
    }
  }
}
