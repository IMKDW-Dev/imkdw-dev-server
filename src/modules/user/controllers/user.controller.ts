import { Controller, Get, Param } from '@nestjs/common';
import UserService from '../services/user.service';
import Requester from '../../../common/decorators/requester.decorator';
import { IRequester } from '../../../common/types/common.type';
import ResponseGetUserInfoDto from '../dto/response/user-info.dto';

@Controller({ path: 'users', version: '1' })
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  async getUserInfo(
    @Requester() requester: IRequester,
    @Param('userId') userId: string,
  ): Promise<ResponseGetUserInfoDto> {
    return this.userService.getUserInfo(requester.userId, userId);
  }
}
