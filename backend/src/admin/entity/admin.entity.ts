import { ApiProperty } from '@nestjs/swagger';

export class AdminEntity {
  @ApiProperty()
  accessToken: string;
}