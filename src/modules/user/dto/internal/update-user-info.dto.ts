import User from '../../domain/entities/user.entity';

export interface UpdateUserInfoDto extends Partial<Pick<User, 'nickname'>> {
  profileImage?: Express.Multer.File;
}
