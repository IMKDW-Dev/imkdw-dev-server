import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { FORBIDDEN_EXCEPTIONS } from '../../../common/exceptions/403';
import RequestUpdateUserDto from '../dto/request/update-user-info.dto';
import UserDto from '../dto/user.dto';
import ResponseGetUserCountDto from '../dto/response/user-count.dto';

export const getUserInfo = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiParam({ description: '유저의 아이디', name: 'userId', example: 'UUID' }),
    ApiForbiddenResponse({
      description: `
      ${FORBIDDEN_EXCEPTIONS.USER_MISMATCH} : "로그인한 유저와 파라미터의 유저 아이디가 불일치
    `,
    }),
    ApiOkResponse({ type: UserDto }),
  );
};

export const updateUser = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: RequestUpdateUserDto }),
    ApiCreatedResponse({ type: UserDto }),
  );
};

export const getUserCount = (summary: string) => {
  return applyDecorators(ApiOperation({ summary }), ApiOkResponse({ type: ResponseGetUserCountDto }));
};
