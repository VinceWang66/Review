import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AdminEntity } from './entity/admin.entity';
import { AdminDto } from './dto/admin.dto';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

@Post('admin')
@ApiOkResponse({ type: AdminEntity })
admin(@Body() { username, password }: AdminDto) {
  return this.adminService.admin(username, password);
}
}