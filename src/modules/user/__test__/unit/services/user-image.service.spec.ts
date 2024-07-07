import { TestBed } from '@automock/jest';
import { IImageService, IMAGE_SERVICE } from '../../../../../infra/image/interfaces/image.interface';
import { IStorageService, STORAGE_SERVICE } from '../../../../../infra/storage/interfaces/storage.interface';
import { generateMulterFile } from '../../../../../__test__/fixtures/create-multer-file.fixture';
import UserImageService from '../../../services/user-image.service';
import { createUser } from '../../fixtures/create-user.fixture';
import ContentType from '../../../../../infra/storage/enums/s3-content-type.enum';

describe('UserImageService', () => {
  let sut: UserImageService;
  let storageService: IStorageService;
  let imageService: IImageService;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UserImageService).compile();
    sut = unit;
    storageService = unitRef.get<IStorageService>(STORAGE_SERVICE);
    imageService = unitRef.get<IImageService>(IMAGE_SERVICE);
  });

  describe('유저와 이미지 파일이 주어지고', () => {
    const user = createUser();
    const image = generateMulterFile();
    const imageExt = image.originalname.split('.').pop();

    describe('프로필 이미지를 요청하면', () => {
      let result: string;
      let uploadSpy: jest.SpyInstance;
      const uploadedUrl = 'uploadedUrl';

      beforeEach(async () => {
        uploadSpy = jest.spyOn(storageService, 'upload').mockResolvedValue(uploadedUrl);
        jest.spyOn(imageService, 'generateThumbnail').mockResolvedValue(image.buffer);
        result = await sut.getProfileImage(user, image);
      });

      it('원본 이미지가 업로드 되고', () => {
        expect(uploadSpy).toHaveBeenNthCalledWith(
          1,
          `users/${user.getId()}/original.${imageExt}`,
          image.buffer,
          ContentType.IMAGE,
        );
      });

      it('썸네일 이미지가 업로드 되고', () => {
        expect(uploadSpy).toHaveBeenNthCalledWith(
          2,
          expect.stringMatching(new RegExp(`^users/${user.getId()}/[^/]+\\.webp$`)),
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
