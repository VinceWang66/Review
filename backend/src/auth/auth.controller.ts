import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

@Post('login')
@ApiOkResponse({ type: AuthEntity })
login(@Body() { username, password }: LoginDto) {
  return this.authService.login(username, password);
}

@Get('check-username')
@ApiOkResponse({ type: AuthEntity })
async checkUsername(@Query('username') username: string) {
  return this.authService.checkUsernameAvailability(username);
}

@Get('check-email')
async checkEmail(@Query('email') email: string) {
  return this.authService.checkEmailAvailability(email);
}
}