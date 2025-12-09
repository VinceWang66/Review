import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ArrayMinSize, IsNumber, Min, ValidateNested, IsString } from "class-validator";

export class CreateOrderDto {
    @IsString()
    @ApiProperty({ required: false, default:'pending', description:'订单状态'})
    status?:string;

    @IsArray()
    @ArrayMinSize(1, { message: '订单至少要一个商品' })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    @ApiProperty({description:'订单项目'})
    items: OrderItemDto[];
}

export class OrderItemDto{
    
    @IsNumber()
    @ApiProperty({description:'购买商品id'})
    productId: number;

    @IsNumber()
    @Min(1,{ message: '购买数量至少为1' })
    @ApiProperty({description:'购买商品数量'})
    quantity: number;
}
