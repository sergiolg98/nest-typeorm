import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    
    if (error instanceof HttpException) {
      status = error.getStatus();
    }

    response.status(status).json({
      statusCode: status,
      message: error.message ?? 'An error occurred',
      name: error.name ?? 'Internal Server Error',
    });
  }
}