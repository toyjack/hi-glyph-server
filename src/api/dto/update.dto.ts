// import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateDto {
  @IsString()
  @IsOptional()
  related: string;

  @IsNotEmpty()
  @IsString()
  data: string;
}
