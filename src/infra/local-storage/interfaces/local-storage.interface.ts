import { InjectionToken } from '@nestjs/common';

export const LOCAL_STORAGE_SERVICE: InjectionToken = Symbol('LOCAL_STORAGE_SERVICE');

export interface ILocalStorageService {
  saveUserId(userId: string, cb: () => void): void;
  getUserId(): string | null;
}
