import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDictionaryDto {
  @ApiProperty({
    description: 'the key of operation',
    example: '1k',
  })
  @IsString()
  @IsNotEmpty()
  public key: String;
  @ApiProperty({
    description: 'the text',
    example: 'Hello',
  })
  @IsString()
  @IsNotEmpty()
  public text: String;
}
