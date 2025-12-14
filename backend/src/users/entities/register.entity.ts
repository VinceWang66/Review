import { ApiProperty } from '@nestjs/swagger';

export class RegisterEntity {
  @ApiProperty({ description: '用户ID' })
  uid: number;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '邮箱' })
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<RegisterEntity>) {
    Object.assign(this, partial);
  }
}