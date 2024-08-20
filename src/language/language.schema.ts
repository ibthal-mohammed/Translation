import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
@Schema()
export class Language {
  @ApiProperty()
  @Prop({ type: String, required: true })
  name: string;
  @ApiProperty()
  @Prop({ type: String, required: true })
  code: string;
}
export const LanguageSchema = SchemaFactory.createForClass(Language);
