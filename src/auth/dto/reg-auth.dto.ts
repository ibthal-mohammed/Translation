import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegAuthDto {
  @ApiProperty({
    description: 'fullName of user',
    example: 'ibthal Mohammed',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  public fullName: string;

  @ApiProperty({
    description: 'email of user',
    example: 'ibthal@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @ApiProperty({
    description: 'password userEmail',
    example: '123456789',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  public password: string;
}
