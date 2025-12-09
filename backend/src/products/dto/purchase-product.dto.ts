import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ValidateNested, IsNumber, Min } from "class-validator";
import { Type } from 'class-transformer';

export class PurchaseItemDto {
    @IsNumber()
    @ApiProperty({ description: '商品ID' })
    productId: number;
    
    @IsNumber()
    @Min(1, {message:'商品数量至少为1'})
    @ApiProperty({ description: '购买数量' })
    quantity: number;
}

export class PurchaseCartDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PurchaseItemDto)
    @ApiProperty({ description: '购物项数组', type: [PurchaseItemDto] })
    items: PurchaseItemDto[];
}
