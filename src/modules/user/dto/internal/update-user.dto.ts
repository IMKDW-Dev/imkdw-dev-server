export interface UpdateUserDto {
  userId: string;
  nickname?: string;
  profileImage?: Express.Multer.File;
}
