import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export default class ContactDto {
  @ApiProperty({ description: '문의자 이름', maxLength: 30 })
  @MaxLength(30)
  @IsString()
  name: string;

  @ApiProperty({ description: '문의자 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '문의 제목', maxLength: 255 })
  @MaxLength(255)
  @IsString()
  subject: string;

  @ApiProperty({ description: '문의 내용', maxLength: 1000 })
  @MaxLength(1000)
  @IsString()
  message: string;
}
