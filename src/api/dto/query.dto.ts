import { IsOptional, IsString, IsInt } from 'class-validator';
import { Transform, Type } from 'class-transformer';
export class QueryDto {
  @IsOptional()
  @IsString()
  contains?: string;

  @IsOptional()
  @IsString()
  related?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsString()
  user?: string;
}
