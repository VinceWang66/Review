import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, Matches, MaxLength, IsString, MinLength, IsBoolean } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsOptional()
    @MinLength(6, { message: '密码至少6个字符' })
    @MaxLength(30, { message: '密码不能超过30个字符' })
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: '密码必须包含字母和数字'
    })
    @ApiProperty({ 
        required: false,
        description: '新密码',
        example: 'newPassword123',
        writeOnly: true
    })
    password?: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ 
        required: false,
        description: '更新卖家状态'
    })
    isseller?: boolean;
}

