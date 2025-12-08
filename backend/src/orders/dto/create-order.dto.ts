import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
    @ApiProperty()
    userId:number;

    @ApiProperty()
    items: OrderItemDto[];
}

export class OrderItemDto{
    @ApiProperty()
    productId: number;

    @ApiProperty()
    quantity: number;
}
