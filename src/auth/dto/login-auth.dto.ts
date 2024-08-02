import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    description: 'email of user',
    example: 'ibthal1@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;
  @ApiProperty({
    description: 'password of user',
    example: '123456789',
  })
  @IsNotEmpty()
  @IsString()
  public password: string;
}
