import { Body, Controller, Get, Param, Patch, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import UserService from '../services/user.service';
import RequestUpdateUserDto from '../dto/request/update-user-info.dto';
import UserGuard from '../../auth/guards/user.guard';
import * as Swagger from '../docs/user.swagger';
import { Public } from '../../auth/decorators/public.decorator';
import ResponseGetUserCountDto from '../dto/response/user-count.dto';
import UserDto from '../dto/user.dto';

@ApiTags('[유저] 공통')
@Controller({ path: 'users', version: '1' })
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Swagger.getUserInfo('유저 정보 조회')
  @Get(':userId')
  @UseGuards(UserGuard)
  async getUserInfo(@Param('userId') userId: string): Promise<UserDto> {
    return this.userService.getUserInfo(userId);
  }

  @Swagger.updateUser('유저 정보 수정')
  @Patch(':userId')
  @UseGuards(UserGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateUser(
    @Param('userId') userId: string,
    @Body() dto: RequestUpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateUser({ ...dto, userId, profileImage: file });
  }

  @Swagger.getUserCount('유저 수 조회')
  @Public()
  @Get('stats/count')
  async getUserCount(): Promise<ResponseGetUserCountDto> {
    const userCount = await this.userService.getUserCount();
    return { userCount };
  }
}
