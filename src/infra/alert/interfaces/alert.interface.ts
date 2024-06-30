import { HttpException } from '@nestjs/common';

export const ALERT_SERVICE = Symbol('ALERT_SERVICE');
export interface IAlertService {
  error(params: IErrorParams): void;
}

export interface IErrorParams {
  error: HttpException | Error;
  method: string;
  url: string;
}
