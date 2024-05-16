import { InjectionToken } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

export const HTTP_REST_SERVICE: InjectionToken = Symbol('HTTP_REST_SERVICE');

export interface HttpRestService {
  get<T>(url: string, options?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, body: unknown, options?: AxiosRequestConfig): Promise<T>;
}
