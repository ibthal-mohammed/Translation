import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
    example: 'ar',
  })
  @IsNotEmpty()
  @IsString()
  targetLanguage: String;
}
