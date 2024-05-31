import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export enum UserRoles {
  NORMAL = 'normal',
  ADMIN = 'admin',
}

export interface UserRoleProps {
  id: number;
  name: string;
}

export default class UserRole {
  constructor(props: UserRoleProps) {
    this.id = props.id;
    this.name = props.name;
  }

  @ApiProperty({ description: 'PK', example: 1, type: Number })
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty({ description: '유저 권한 이름', example: UserRoles.NORMAL })
  @IsString()
  name: string;

  toString() {
    return this.name;
  }

  static create(props: UserRoleProps): UserRole {
    return new UserRole(props);
  }
}
