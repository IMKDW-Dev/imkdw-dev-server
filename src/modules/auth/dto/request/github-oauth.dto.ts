import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReqeustGithubOAuthDto {
  @ApiProperty({ description: '발급받은 code' })
  @IsString()
  readonly code: string;

  @ApiProperty({ description: '지정한 redirect_uri' })
  @IsString()
  readonly redirectUri: string;
}
