import { ApiProperty } from "@nestjs/swagger";
import { User } from ".prisma/client";
import { Exclude } from 'class-transformer';

export class UserEntity implements User{
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
      }
  
    @ApiProperty()
    uid: number;

    @ApiProperty()
    username: string;

    @ApiProperty()
    @Exclude()
    password: string;

    @ApiProperty()
    email: string;
    
    @ApiProperty()
    isseller: boolean;

    @ApiProperty()
    role: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

