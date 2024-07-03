import { TestBed } from '@automock/jest';
import UserService from '../../../services/user.service';
import { IUserRepository, USER_REPOSITORY } from '../../../repository/user/user-repo.interface';
import { createUser } from '../../fixtures/create-user.fixture';
import { generateUUID } from '../../../../../common/utils/uuid';
import { createUpdateUserDto } from '../../fixtures/update-user.fixture';
import { UserNotFoundException } from '../../../../../common/exceptions/404';
import UserImageService from '../../../services/user-image.service';
import { generateMulterFile } from '../../../../../__test__/fixtures/create-multer-file.fixture';
import { DuplicateNicknameException } from '../../../../../common/exceptions/409';

describe('UserService', () => {
  let sut: UserService;
  let userRepository: IUserRepository;
  let userImageService: UserImageService;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UserService).compile();
    sut = unit;
    userRepository = unitRef.get(USER_REPOSITORY);
    userImageService = unitRef.get(UserImageService);
  });

  describe('유저 업데이트', () => {
    it('유저를 찾을 수 없는경우 UserNotFoundException 에러가 발생한다', async () => {
      // Given
      const userId = generateUUID();
      const dto = createUpdateUserDto();

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      // When, Then
      await expect(sut.updateUser(userId, dto)).rejects.toThrow(UserNotFoundException);
    });

    it('프로필 이미지만 있는 경우 프로필 이미지만 변경한다', async () => {
      // Given
      const userId = generateUUID();
      const profile = 'dummy_profile_image';
      const dto = createUpdateUserDto({ profileImage: generateMulterFile() });

      const user = createUser({ id: userId });
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(user);

      const getProfileImageSpy = jest.spyOn(userImageService, 'getProfileImage').mockResolvedValueOnce(profile);

      // When
      const result = await sut.updateUser(userId, dto);

      // Then
      expect(getProfileImageSpy).toHaveBeenCalledWith(user, dto.profileImage);
      expect(result.profile).toBe(profile);
      expect(result.nickname).toBe(user.getNickname());
    });

    describe('닉네임 변경', () => {
      it('중복된 닉네임이 있는 경우 DuplicateNicknameException 에러가 발생한다', async () => {
        // Given
        const userId = generateUUID();
        const dto = createUpdateUserDto({ nickname: 'dummy_nickname' });

        const user = createUser({ id: userId });
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);

        // When, Then
        await expect(sut.updateUser(userId, dto)).rejects.toThrow(DuplicateNicknameException);
      });

      it('닉네임만 있는 경우 닉네임만 변경한다', async () => {
        // Given
        const userId = generateUUID();
        const nickname = 'nickname';
        const dto = createUpdateUserDto({ nickname });

        const user = createUser({ id: userId });
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
        jest.spyOn(userRepository, 'update').mockResolvedValueOnce(user);
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

        // When
        const result = await sut.updateUser(userId, dto);

        // Then
        expect(result.profile).toBe(user.getProfile());
        expect(result.nickname).toBe(nickname);
      });
    });
  });
});
