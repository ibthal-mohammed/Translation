import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTranslateDto } from './create-translate.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTranslateDto extends PartialType(CreateTranslateDto) {
  @ApiProperty({
    description: 'the key of operation',
    example: '1k',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public key?: string;

  @ApiProperty({
    description: 'the text',
    example: 'Hello',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public text?: string;

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
