import { ApiProperty } from '@nestjs/swagger';
import IsArticleId from '../../decorators/validation/is-article-id.decorator';
import { generateCUID } from '../../../../common/utils/cuid';

export default class ArticleId {
  constructor(id: string) {
    this.id = id;
  }

  @ApiProperty({
    description: '게시글 아이디, 공백 사용 불가능',
    example: 'how-to-use-nestjs',
    minLength: 1,
    maxLength: 245,
  })
  @IsArticleId()
  id: string;

  addHash() {
    const cuid = generateCUID();
    const hash = cuid.slice(0, 10);
    this.id = `${this.id}-${hash}`;
  }

  toString() {
    return this.id;
  }
}
