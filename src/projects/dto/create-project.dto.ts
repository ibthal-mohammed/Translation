import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'the project title',
    example: 'projectOne',
  })
  @IsNotEmpty()
  @IsString()
  public title: String;
  @ApiProperty({
    description: 'language you want translate to',
    example: ['ar', 'fr'],
  })
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  targetLanguage: [String];
}
