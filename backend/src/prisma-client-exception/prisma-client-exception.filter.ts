import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);  // 3
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '数据库操作错误';
    
    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        const fields = (exception.meta?.target as string[]) || [];

        if (fields.includes('username')) {
          message = '用户名已存在';
        } else if (fields.includes('email')) {
          message = '邮箱已注册';
        } else if (fields.includes('pname')) {
          message = '商品名称已存在';
        } else {
          message = `${fields.join(', ')} 已存在`;
        }
        break;
      }
      case 'P2025':{
        status = HttpStatus.NOT_FOUND;
        message = '记录不存在'
        break;
      }
      case 'P2003':{
        status = HttpStatus.BAD_REQUEST;
        message = '关联数据不存在';
        break;
      }
      case 'P2014':
        status = HttpStatus.BAD_REQUEST;
        message = 'ID关系错误';
        break;
      default:
      // default 500 error code
      return super.catch(exception, host);
    }
    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString()
    });
  }
}
