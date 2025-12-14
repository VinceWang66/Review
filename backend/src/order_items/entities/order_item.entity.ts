import { OrderItem } from ".prisma/client";

export class OrderItemEntity implements OrderItem{
    oiid: number;
    quantity: number;
    orderId: number;
    productId: number;
}
