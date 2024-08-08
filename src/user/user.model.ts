import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
