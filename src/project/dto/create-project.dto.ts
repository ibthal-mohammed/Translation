import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isLangugeValid', async: false })
export class IsLangugeValid implements ValidatorConstraintInterface {
  validate(targetLanguage: string[]): boolean {
    if (!Array.isArray(targetLanguage)) return false;

    return targetLanguage.every(
      (item) => typeof item === 'string' && item.trim().length > 0,
    );
  }
  defaultMessage(): string {
    return 'targetLanguage cannot consist only white space';
  }
}
export class CreateProjectDto {
  @ApiProperty({
    description: 'the project title',
    example: 'projectOne',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  public title: string;
  @ApiProperty({
    description: 'language you want translate to',
    example: ['ar', 'fr'],
  })
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  targetLanguages: string[];
}
