import { Category } from ".prisma/client";

export class CategoryEntity implements Category{
    cid: number;
    cname: string;
}
