// 创建一个测试控制器
// src/test/test.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('test')
export class TestController {
  @Get('auth-info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getAuthInfo(@Req() req) {
    return {
      success: true,
      message: '认证测试',
      user: req.user,
      userKeys: Object.keys(req.user),
      hasUserId: !!req.user.userId,
      hasUid: !!req.user.uid,
      timestamp: new Date().toISOString(),
    };
  }
}