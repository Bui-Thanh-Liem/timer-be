import { IBaseResponse } from 'src/interfaces/response';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export abstract class AResponse<T = any> {
  message: string;
  data?: T | undefined;
  error?: string;
  path?: string;
  timestamp?: any;
  abstract statusCode: number;
  abstract responseStatusCode: string;

  constructor({ message, data, error, path, timestamp }: IBaseResponse<T>) {
    this.message = message;
    this.data = data;
    this.error = error;
    this.path = path;
    this.timestamp = timestamp;
  }
}

export class AResponseOk<T> extends AResponse {
  statusCode: number = StatusCodes.OK;
  responseStatusCode: string = ReasonPhrases.OK;

  constructor({ message, data }: IBaseResponse<T>) {
    super({ message, data });
  }
}

export class AResponseError<T> extends AResponse {
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
  responseStatusCode: string = ReasonPhrases.INTERNAL_SERVER_ERROR;

  constructor({ message, data, error, path, timestamp }: IBaseResponse<T>) {
    super({ message, data, error, path, timestamp });
  }
}
