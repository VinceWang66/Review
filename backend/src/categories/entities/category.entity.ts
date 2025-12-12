import { Category } from "generated/prisma/client";

export class CategoryEntity implements Category{
    cid: number;
    cname: string;
}
