import { Decimal } from "@prisma/client/runtime/client";
import { Order } from "generated/prisma/client";

export class OrderEntity implements Order{
    oid: number;
    totalAmount: Decimal;
    status: string;
    userId: number;
    createdAt: Date;
}
