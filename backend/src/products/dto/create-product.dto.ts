import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
    @ApiProperty()
    pname: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    stock: number;

    @ApiProperty()
    price: string;

    @ApiProperty()
    categoryName: string;

    @ApiProperty()
    sellerId: number;
}
