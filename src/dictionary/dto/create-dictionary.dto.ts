import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDictionaryDto {
  @ApiProperty({
    description: 'the key of operation',
    example: '1k',
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  public key: String;
  @ApiProperty({
    description: 'the text',
    example: 'Hello',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  public text: String;
}
