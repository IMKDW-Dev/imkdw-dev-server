import { TestBed } from '@automock/jest';
import CategoryImageService from '../../../services/category-image.service';
import { createCategory } from '../../fixtures/create-category.fixture';
import { IStorageService, STORAGE_SERVICE } from '../../../../../../infra/storage/interfaces/storage.interface';
import { IImageService, IMAGE_SERVICE } from '../../../../../../infra/image/interfaces/image.interface';
import { generateMulterFile } from '../../../../../../__test__/fixtures/create-multer-file.fixture';
import ContentType from '../../../../../../infra/storage/enums/s3-content-type.enum';

describe('CategoryImageService', () => {
  let sut: CategoryImageService;
  let storageService: IStorageService;
  let imageService: IImageService;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(CategoryImageService).compile();

    sut = unit;
    storageService = unitRef.get<IStorageService>(STORAGE_SERVICE);
    imageService = unitRef.get<IImageService>(IMAGE_SERVICE);
  });

  describe('카테고리와 이미지 파일이 주어지고', () => {
    const category = createCategory();
    const image = generateMulterFile();
    const imageExt = image.originalname.split('.').pop();

    describe('카테고리 이미지를 요청하면', () => {
      let result: string;
      let uploadSpy: jest.SpyInstance;
      const uploadedUrl = 'uploadedUrl';

      beforeEach(async () => {
        uploadSpy = jest.spyOn(storageService, 'upload').mockResolvedValue(uploadedUrl);
        jest.spyOn(imageService, 'generateThumbnail').mockResolvedValue(image.buffer);
        result = await sut.getImage(category, image);
      });

      it('원본 이미지가 업로드 되고', () => {
        expect(uploadSpy).toHaveBeenNthCalledWith(
          1,
          `categories/${category.getId()}/original.${imageExt}`,
          image.buffer,
          ContentType.IMAGE,
        );
      });

      it('썸네일 이미지가 업로드 되고', () => {
        expect(uploadSpy).toHaveBeenNthCalledWith(
          2,
          expect.stringMatching(new RegExp(`^categories/${category.getId()}/[^/]+\\.webp$`)),
          image.buffer,
          ContentType.IMAGE,
        );
      });

      it('업로드된 썸네일 이미지의 URL을 반환한다', () => {
        expect(result).toBe(uploadedUrl);
      });
    });
  });
});
