import { UpdateUserDto } from '../../dto/internal/update-user.dto';

// eslint-disable-next-line import/prefer-default-export
export const createUpdateUserDto = (params?: Partial<UpdateUserDto>): UpdateUserDto => {
  return {
    nickname: '',
    profileImage: null,
    ...params,
  };
};
