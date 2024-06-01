import { ApiProperty, PickType } from '@nestjs/swagger';
import CategoryDto from '../../category/dto/category.dto';
import TagDto from '../../tag/dto/tag.dto';
import ArticleCommentDto from '../../article-comment/dto/article-comment.dto';
import Article from '../domain/entities/article.entity';

interface Props {
  id: string;
  title: string;
  category: CategoryDto;
  content: string;
  visible: boolean;
  thumbnail: string;
  viewCount: number;
  commentCount: number;
  createdAt: Date;
  tags: TagDto[];
  comments: ArticleCommentDto[];
}

export default class ArticleDto extends PickType(Article, [
  'title',
  'content',
  'visible',
  'thumbnail',
  'viewCount',
  'commentCount',
  'createdAt',
]) {
  constructor(props: Props) {
    super(props);
    this.id = props.id;
    this.category = props.category;
    this.tags = props.tags;
    this.comments = props.comments;
  }

  @ApiProperty({ description: '게시글 아이디', example: 'how-to-use-nestjs-ani213ijoasds' })
  id: string;

  @ApiProperty({ description: '카테고리', type: CategoryDto })
  category: CategoryDto;

  @ApiProperty({ description: '태그 목록', type: [TagDto] })
  tags: TagDto[];

  @ApiProperty({ description: '댓글 목록', type: [ArticleCommentDto] })
  comments: ArticleCommentDto[];

  static create(props: Props) {
    return new ArticleDto(props);
  }
}
