import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({message:'用户名不能为空'})
    @MinLength(2, {message:'用户名不能少于两位'})
    @MaxLength(20, {message:'用户名不能多余20个字符'})
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
        message: '密码必须包含字母和数字'
      })
    @ApiProperty({ 
        description: '用户名（唯一）',
        example: 'john_doe123'
      })
    username: string;

    @IsString()
    @IsNotEmpty({message:'密码不能为空'})
    @MinLength(6, {message:'密码不能小于6位'})
    @MaxLength(30, {message:'密码不能超过30个字符'})
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
        message: '密码必须包含字母和数字'
      })
    @ApiProperty({
        description: '密码',
        example: 'password123',
        writeOnly: true
    })
    password: string;

    @IsEmail({},{message:'邮箱格式不正确'})
    @IsNotEmpty({message:'邮箱不能为空'})
    @ApiProperty({ 
        description: '邮箱地址（唯一）',
        example: 'user@example.com'
      })
    email: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({required:false, default: false, description:'是否为卖家'})
    isseller?: boolean
}
