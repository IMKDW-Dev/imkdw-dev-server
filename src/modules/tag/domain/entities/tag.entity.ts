import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import IsTagName from '../../decorators/validation/is-tag-name.decorator';

interface Props {
  id?: number;
  name?: string;
}
export default class Tag {
  constructor(props: Props) {
    this.id = props.id;
    this.name = props.name;
  }

  @ApiProperty({ description: '아이디', example: 1 })
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty({ description: '태그 이름', minLength: 2, maxLength: 20, example: 'Backend' })
  @IsTagName()
  name: string;

  static create(props: Props): Tag {
    return new Tag(props);
  }
}
