import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import IsTagName from '../decorators/validation/is-tag-name.decorator';

export default class TagDto {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  @ApiProperty({ description: '태그 아이디' })
  @IsNumber()
  @Transform(({ value }) => +value)
  id: number;

  @ApiProperty({ description: '태그 이름' })
  @IsTagName()
  name: string;
}
