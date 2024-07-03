import { AxiosRequestConfig } from 'axios';

export const HTTP_REST_SERVICE = Symbol('HTTP_REST_SERVICE');

export interface IHttpRestService {
  get<T>(url: string, options?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, body: unknown, options?: AxiosRequestConfig): Promise<T>;
}
