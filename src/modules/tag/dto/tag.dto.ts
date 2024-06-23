import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

interface Props extends TagDto {}

export default class TagDto {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  @ApiProperty({ description: '태그 아이디' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;

  @ApiProperty({ description: '태그 이름' })
  @IsString()
  name: string;

  static create(props: Props) {
    return new TagDto(props.id, props.name);
  }
}
