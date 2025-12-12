import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @MaxLength(20,{message:'商品类别不能多于20个字符'})
    @IsNotEmpty({message:'商品类别不能为空'})
    @ApiProperty({description:'商品类别'})
    cname: string;
}
