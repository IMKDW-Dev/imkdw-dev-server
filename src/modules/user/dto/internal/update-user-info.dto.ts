import User from '../../domain/models/user.model';

export interface UpdateUserInfoDto extends Partial<Pick<User, 'nickname'>> {
  profileImage?: Express.Multer.File;
}
