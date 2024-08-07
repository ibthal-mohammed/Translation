import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTranslateDto } from './create-translate.dto';
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateTranslateDto extends PartialType(CreateTranslateDto) {
  @ApiProperty({
    description: 'translate the text',
    example: ['Bonjour', 'مرحبا'],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  public value?: string[];
}
