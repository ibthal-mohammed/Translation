import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class Project {
  @ApiProperty()
  title: string;
  @ApiProperty()
  userId: ObjectId;
  @ApiProperty()
  targetLanguage: string;
}
