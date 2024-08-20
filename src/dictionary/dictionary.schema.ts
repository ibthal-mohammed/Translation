import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { ObjectId } from 'mongoose';
@Schema()
export class Dictionary {
  @ApiProperty()
  @Prop({ type: String, required: true })
  key: string;
  @ApiProperty()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  })
  projectId: mongoose.Schema.Types.ObjectId;
  @ApiProperty()
  @Prop({ type: String, required: true })
  text: string;
  @ApiProperty()
  @Prop({ type: [String], required: true })
  value: string[];
}
export const DictionarySchema = SchemaFactory.createForClass(Dictionary);
