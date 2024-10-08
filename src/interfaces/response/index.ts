import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export interface IBaseResponse<T> {
  message: string;
  data?: T;
  path?: string;
  error?: string;
  timestamp?: any;
  statusCode?: StatusCodes;
  reasonStatusCode?: ReasonPhrases;
}

export interface IResponseLogin<T> {
  user: T;
  token: string;
}

export interface IErrorResponse {
  path: string;
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}
