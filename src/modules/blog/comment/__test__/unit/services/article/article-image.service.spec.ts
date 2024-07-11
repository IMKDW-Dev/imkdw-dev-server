import { ConfigService } from '@nestjs/config';
import { TestBed } from '@automock/jest';

import { IImageService, IMAGE_SERVICE } from '../../../../../../../infra/image/interfaces/image.interface';
import { IStorageService, STORAGE_SERVICE } from '../../../../../../../infra/storage/interfaces/storage.interface';
import { generateMulterFile } from '../../../../../../../__test__/fixtures/create-multer-file.fixture';
import ContentType from '../../../../../../../infra/storage/enums/s3-content-type.enum';
import ArticleImageService from '../../../../../article/services/article-image.service';
import ArticleId from '../../../../../article/domain/vo/article-id.vo';

describe('ArticleImageService', () => {
  let sut: ArticleImageService;
  let storageService: IStorageService;
  let imageService: IImageService;
  let configService: ConfigService;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(ArticleImageService).compile();
    sut = unit;
    storageService = unitRef.get<IStorageService>(STORAGE_SERVICE);
    imageService = unitRef.get<IImageService>(IMAGE_SERVICE);
    configService = unitRef.get<ConfigService>(ConfigService);
  });

  describe('게시글 아이디와 이미지 파일이 주어지고', () => {
    const articleId = new ArticleId('a'.repeat(20));
    const image = generateMulterFile();
    const imageExt = image.originalname.split('.').pop();

    describe('썸네일 이미지를 요청하면', () => {
      let result: string;
      let uploadSpy: jest.SpyInstance;
      const uploadedUrl = 'uploadedUrl';

      beforeEach(async () => {
        uploadSpy = jest.spyOn(storageService, 'upload').mockResolvedValue(uploadedUrl);
        jest.spyOn(imageService, 'generateThumbnail').mockResolvedValue(image.buffer);
        result = await sut.getThumbnail(articleId, image);
      });

      it('원본 이미지가 업로드 되고', () => {
        expect(uploadSpy).toHaveBeenNthCalledWith(
          1,
          `articles/${articleId.toString()}/thumbnail/original.${imageExt}`,
          image.buffer,
          ContentType.IMAGE,
        );
      });

      it('썸네일 이미지가 업로드 되고', () => {
        expect(uploadSpy).toHaveBeenNthCalledWith(
          2,
          expect.stringMatching(new RegExp(`^articles/${articleId.toString()}/thumbnail/[^/]+\\.webp$`)),
          image.buffer,
          ContentType.IMAGE,
        );
      });

      it('업로드된 썸네일 이미지의 URL을 반환한다', () => {
        expect(result).toBe(uploadedUrl);
      });
    });
  });

  describe('게시글 아이디와 이미지 목록이 주어지고', () => {
    const articleId = new ArticleId('a'.repeat(20));
    const images = ['image1.jpg', 'image2.jpg'];

    describe('이미지 목록을 복사하면', () => {
      let result: { fromPath: string; toPath: string }[];
      let copyImageSpy: jest.SpyInstance;
      beforeEach(async () => {
        copyImageSpy = jest.spyOn(storageService, 'copyFile').mockResolvedValue(null);
        result = await sut.copyContentImages(articleId, images);
      });

      it('스토리지에 이미지를 복사하고', () => {
        expect(copyImageSpy).toHaveBeenNthCalledWith(
          1,
          `${configService.get<string>('S3_PRESIGNED_BUCKET_NAME')}/image1.jpg`,
          `articles/${articleId.toString()}/content-images/image1.jpg`,
        );
        expect(copyImageSpy).toHaveBeenNthCalledWith(
          2,
          `${configService.get<string>('S3_PRESIGNED_BUCKET_NAME')}/image2.jpg`,
          `articles/${articleId.toString()}/content-images/image2.jpg`,
        );
      });

      it('이미지 목록을 반환한다', () => {
        const S3_BUCKET_URL = configService.get<string>('S3_BUCKET_URL');
        const S3_PRESIGNED_BUCKET_URL = configService.get<string>('S3_PRESIGNED_BUCKET_URL');

        expect(result).toEqual([
          {
            fromPath: `${S3_PRESIGNED_BUCKET_URL}/image1.jpg`,
            toPath: `${S3_BUCKET_URL}/articles/${articleId.toString()}/content-images/image1.jpg`,
          },
          {
            fromPath: `${S3_PRESIGNED_BUCKET_URL}/image2.jpg`,
            toPath: `${S3_BUCKET_URL}/articles/${articleId.toString()}/content-images/image2.jpg`,
          },
        ]);
      });
    });
  });
});
