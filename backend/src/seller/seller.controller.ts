import { Body, Controller, Post } from '@nestjs/common';
import { SellerService } from './seller.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SellerEntity } from './entity/seller.entity';
import { SellerDto } from './dto/seller.dto';

@Controller('seller')
@ApiTags('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

@Post('seller')
@ApiOkResponse({ type: SellerEntity })
seller(@Body() { username, password }: SellerDto) {
  return this.sellerService.seller(username, password);
}
}