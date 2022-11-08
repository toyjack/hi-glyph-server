import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDto {
  @ApiProperty({
    required: false,
    description: '字形データに含まれるグリフ名',
    example: 'u4e00',
  })
  @IsOptional()
  @IsString()
  contains?: string;

  @ApiProperty({
    required: false,
    description: '関連漢字のグリフ名',
    example: 'u4e00',
  })
  @IsOptional()
  @IsString()
  related?: string;

  @ApiProperty({
    required: false,
    minimum: 0,
    default: 0,
    example: 0,
    description: '検索結果のオフセット量',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  skip?: number;

  @ApiProperty({
    required: false,
    minimum: 1,
    default: 50,
    example: 50,
    description: '検索結果の取得件数',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  take?: number;

  @ApiProperty({
    required: false,
    description: 'グリフを作成したユーザー名',
    example: 'hdic',
  })
  @IsOptional()
  @IsString()
  user?: string;
}
