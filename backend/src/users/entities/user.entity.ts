import { ApiProperty } from "@nestjs/swagger";
import { User } from "generated/prisma/client";

export class UserEntity implements User{
    
    @ApiProperty()
    uid: number;

    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    email: string;
    
    @ApiProperty()
    isseller: boolean;
}
