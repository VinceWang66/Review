import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class SinglePurchaseDto {
  @IsNumber()
  @Min(1, {message:'商品数量至少为1'})
  @ApiProperty({ description: '购买数量' })
  quantity: number;
}
