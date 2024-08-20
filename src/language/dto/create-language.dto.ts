import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateLanguageDto {
  @ApiProperty({ example: 'en', description: 'The language code' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  code: string;

  @ApiProperty({ example: 'English', description: 'The language name' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;
}
