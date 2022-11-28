// import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class KageEditor {
  @IsString()
  @IsNotEmpty()
  page: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  textbox: string;

  @IsString()
  @IsNotEmpty()
  related: string;

  @IsString()
  summary: string;
}
