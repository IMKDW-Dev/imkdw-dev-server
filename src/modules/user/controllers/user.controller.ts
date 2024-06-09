import { Body, Controller, Get, Param, Patch, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import UserService from '../services/user.service';
import ResponseGetUserInfoDto from '../dto/response/user-info.dto';
import RequestUpdateUserInfoDto from '../dto/request/update-user-info.dto';
import UserGuard from '../../auth/guards/user.guard';
import * as Swagger from '../docs/user.swagger';
import { Public } from '../../auth/decorators/public.decorator';
import ResponseGetUserCountDto from '../dto/response/user-count.dto';

@Controller({ path: 'users', version: '1' })
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Swagger.getUserInfo('유저 정보 조회')
  @Get(':userId')
  @UseGuards(UserGuard)
  async getUserInfo(@Param('userId') userId: string): Promise<ResponseGetUserInfoDto> {
    return this.userService.getUserInfo(userId);
  }

  @Swagger.updateUserInfo('유저 정보 수정')
  @Patch(':userId')
  @UseGuards(UserGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateUserInfo(
    @Param('userId') userId: string,
    @Body() dto: RequestUpdateUserInfoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateUserInfo(userId, { ...dto, profileImage: file });
  }

  @Swagger.getUserCount('유저 수 조회')
  @Public()
  @Get('stats/count')
  async getUserCount(): Promise<ResponseGetUserCountDto> {
    const userCount = await this.userService.getUserCount();
    return { userCount };
  }
}
