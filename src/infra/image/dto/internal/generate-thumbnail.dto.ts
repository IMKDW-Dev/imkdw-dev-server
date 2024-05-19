export interface GenerateThumbnailDto {
  image: Express.Multer.File;
  width: number;
  height?: number;
  quality?: number;
}
