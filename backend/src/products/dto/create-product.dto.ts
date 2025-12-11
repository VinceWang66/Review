import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Max, Min, MaxLength, IsOptional } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty({message:'商品名称不能为空'})
    @MaxLength(100, {message:'商品名称不能超过100个字'})
    @ApiProperty({description:'商品名称'})
    pname: string;

    @IsString()
    @MaxLength(1000, {message:'商品描述不能超过1000个字'})
    @ApiProperty({description:'商品描述'})
    description: string;

    @IsNumber()
    @Min(0, {message:'商品库存不能为负数'})
    @ApiProperty({description:'商品库存'})
    stock: number;

    @IsString()
    @IsNotEmpty({message:'商品价格不能为空'})
    @ApiProperty({description:'商品价格'})
    price: string;

    @IsOptional()
    @IsString()
    @MaxLength(50,{message: '商品分类不能超过50个字'})
    @ApiProperty({description:'商品分类名称', required: false})
    categoryName?: string;
    
    @IsOptional()
    @IsNumber()
    @Min(1, {message:'商品分类ID必须大于0'})
    @ApiProperty({description:'商品分类ID', required: false})
    categoryId?: number;
}
