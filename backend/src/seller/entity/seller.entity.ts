import { ApiProperty } from '@nestjs/swagger';

export class SellerEntity {
  @ApiProperty()
  accessToken: string;
}