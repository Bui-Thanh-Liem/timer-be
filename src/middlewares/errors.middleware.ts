import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IErrorResponse } from 'src/interfaces/response';
import { StatusCodes } from 'http-status-codes';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // 
    let errMessage: string;
    const responseErr = exception.getResponse() as IErrorResponse;

    // 
    if (typeof responseErr.message === 'object' && responseErr.message) {
      errMessage = responseErr.message[0];
    } else {
      errMessage = responseErr.message;
    }

    const resultError = {
      statusCode: responseErr.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      error: responseErr.error,
      message: errMessage,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(responseErr.statusCode).json(resultError);
  }
}
