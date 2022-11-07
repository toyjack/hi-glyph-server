import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'user email',
    default: 'aa@aa.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'user password',
    default: '123456',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
