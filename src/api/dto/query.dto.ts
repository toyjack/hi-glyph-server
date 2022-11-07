import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDto {
  @ApiProperty({
    required: false,
    description: 'blablabla...',
    example: 'u4e00',
  })
  @IsOptional()
  @IsString()
  contains?: string;

  @ApiProperty({
    required: false,
    description: 'blablabla...',
    example: 'u4e00',
  })
  @IsOptional()
  @IsString()
  related?: string;

  @ApiProperty({ required: false, minimum: 0, default: 0, example: 0 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  skip?: number;

  @ApiProperty({ required: false, minimum: 1, default: 50, example: 50 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  take?: number;

  @ApiProperty({
    required: false,
    description: 'blablabla...',
    example: 'hdic',
  })
  @IsOptional()
  @IsString()
  user?: string;
}
