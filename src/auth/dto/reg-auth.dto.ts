import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
@ValidatorConstraint({ name: 'isFullNameValid', async: false })
export class IsFullNameValid implements ValidatorConstraintInterface {
  validate(fullName: string) {
    const alphabeticPattern = /^[a-zA-Z\s]+$/;
    const parts = fullName.split(' ');
    return parts.length >= 2 && alphabeticPattern.test(fullName);
  }
  defaultMessage(): string {
    return 'Full name must contain both first and last names and only characters';
  }
}
export class RegAuthDto {
  @ApiProperty({
    description: 'fullName of user',
    example: 'ibthal Mohammed',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  @Validate(IsFullNameValid)
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
  @MaxLength(16)
  @Transform(({ value }) => value.trim())
  // @Validate(IsPasswordValid)
  public password: string;
}
