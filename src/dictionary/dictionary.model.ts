import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
export class Translate {
  @ApiProperty()
  key: string;
  @ApiProperty()
  projectId: ObjectId;
  @ApiProperty()
  text: string;
  @ApiProperty()
  value: string[];
}
