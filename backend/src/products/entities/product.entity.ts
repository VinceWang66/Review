import { Decimal } from "@prisma/client/runtime/client";
import { Product } from ".prisma/client";

export class ProductEntity implements Product{
    pid: number;
    pname: string;
    description: string;
    stock: number;
    price: Decimal;
    categoryId: number;
    sellerId: number;
    createdAt: Date;
    updatedAt: Date;
    category?: {
        cname: string;
    };
    constructor(partial: Partial<ProductEntity>) {
        Object.assign(this, partial);
    }
}
