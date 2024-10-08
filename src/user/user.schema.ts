import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
@Schema()
export class User {
  @ApiProperty()
  @Prop({ type: String, required: true })
  fullName: string;
  @ApiProperty()
  @Prop({ type: String, required: true })
  email: string;
  @ApiProperty()
  @Prop({ type: String, required: true })
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
