import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IStorageService, STORAGE_SERVICE } from '../interfaces/storage.interface';
import * as Swagger from '../docs/storage.swagger';
import AdminGuard from '../../../modules/auth/guards/admin.guard';
import { Roles } from '../../../modules/auth/decorators/roles.decorator';
import ResponseGetUploadUrlDto from '../dto/response/get-upload-url.dto';
import { userRoles } from '../../../modules/user/domain/models/user-role.model';

@ApiTags('[스토리지] 공통')
@Controller({ path: 'storage', version: '1' })
@UseGuards(AdminGuard)
@Roles(userRoles.admin.name)
export default class StorageController {
  constructor(@Inject(STORAGE_SERVICE) private readonly storageService: IStorageService) {}

  @Swagger.getUploadUrl('파일 업로드를 위한 임시 URL 발급')
  @Get('upload-url')
  async getUploadUrl(@Query('filename') filename: string): Promise<ResponseGetUploadUrlDto> {
    const url = await this.storageService.getUploadUrl(filename);
    return { url };
  }
}
