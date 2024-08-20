import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { ObjectId } from 'mongoose';

@Schema()
export class Project {
  @ApiProperty()
  @Prop({ type: String, required: true })
  title: string;
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;
  @ApiProperty()
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
    required: true,
  })
  targetLanguages: mongoose.Schema.Types.ObjectId[];
}
export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ title: 1, userId: 1 }, { unique: true });
