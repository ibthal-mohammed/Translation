import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDictionaryDto } from './index';
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateDictionaryDto extends PartialType(CreateDictionaryDto) {
  @ApiProperty({
    description: 'translate the text',
    example: ['Bonjour', 'مرحبا'],
    required: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  public value?: string[];
}
