import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
@ValidatorConstraint({ name: 'isFullNameValid', async: false })
export class IsFullNameValid implements ValidatorConstraintInterface {
  validate(fullName: string) {
    const alphabeticPattern = /^[a-zA-Z\s]+$/;
    const trimmedName = fullName.trim();
    const parts = trimmedName.split(' ');
    return parts.length >= 2 && alphabeticPattern.test(fullName);
  }
  defaultMessage(): string {
    return 'Full name must contain both first and last names and only characters';
  }
}
@ValidatorConstraint({ name: 'isPasswordValid', async: false })
export class IsPasswordValid implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    const trimmedPassword = password.trim();
    return (
      trimmedPassword.length >= 8 && trimmedPassword.length === password.length
    );
  }
  defaultMessage(): string {
    return 'Password must be at least 8 characters long and cannot consist only of whitespace';
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
  @Validate(IsPasswordValid)
  public password: string;
}
