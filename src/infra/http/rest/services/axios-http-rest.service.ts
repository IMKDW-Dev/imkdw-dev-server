import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IHttpRestService } from '../interfaces/http-rest.interface';

@Injectable()
export default class AxiosHttpRestService implements IHttpRestService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create();
  }

  async get<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.get<T>(url, options);
      return response.data;
    } catch (error) {
      Logger.error(JSON.stringify(error));
      return null;
    }
  }

  async post<T>(url: string, body: unknown, options?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.post<T>(url, body, options);
      return response.data;
    } catch (error) {
      Logger.error(JSON.stringify(error));
      return null;
    }
  }
}
