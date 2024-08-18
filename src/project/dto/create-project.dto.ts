import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
@ValidatorConstraint({ name: 'isTitleValid', async: false })
export class IsTiltedNameValid implements ValidatorConstraintInterface {
  validate(title: string) {
    const trimmedTitle = title.trim();
    return trimmedTitle.length > 0;
  }
  defaultMessage(): string {
    return 'title  cannot consist only of whitespace';
  }
}
@ValidatorConstraint({ name: 'isLangugeValid', async: false })
export class IsLangugeValid implements ValidatorConstraintInterface {
  validate(targetLanguage: string[]): boolean {
    if (!Array.isArray(targetLanguage)) return false;

    return targetLanguage.every(
      (item) => typeof item === 'string' && item.trim().length > 0,
    );
  }

  defaultMessage(): string {
    return 'targetLanguage cannot consist only whitw space';
  }
}
export class CreateProjectDto {
  @ApiProperty({
    description: 'the project title',
    example: 'projectOne',
  })
  @IsNotEmpty()
  @IsString()
  @Validate(IsTiltedNameValid)
  public title: String;
  @ApiProperty({
    description: 'language you want translate to',
    example: ['ar', 'fr'],
  })
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  targetLanguage: String[];
}
