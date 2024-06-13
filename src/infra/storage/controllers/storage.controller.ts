import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { IStorageService, STORAGE_SERVICE } from '../interfaces/storage.interface';
import * as Swagger from '../docs/storage.swagger';
import AdminGuard from '../../../modules/auth/guards/admin.guard';
import { Roles } from '../../../modules/auth/decorators/roles.decorator';
import UserRoles from '../../../modules/user/enums/user-role.enum';
import ResponseGetUploadUrlDto from '../dto/response/get-upload-url.dto';

@Controller({ path: 'storage', version: '1' })
@UseGuards(AdminGuard)
@Roles(UserRoles.ADMIN)
export default class StorageController {
  constructor(@Inject(STORAGE_SERVICE) private readonly storageService: IStorageService) {}

  @Swagger.getUploadUrl('파일 업로드를 위한 임시 URL 발급')
  @Get('upload-url')
  async getUploadUrl(@Query('filename') filename: string): Promise<ResponseGetUploadUrlDto> {
    const url = await this.storageService.getUploadUrl(filename);
    return { url };
  }
}
