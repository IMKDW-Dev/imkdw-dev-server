export const LOGGER = Symbol('Logger');

interface ILoggerCommonParams {
  timestamp: string;
  requester: string;
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  status: number;
  processingTime: string;
  request: {
    body: unknown;
    query: unknown;
    params: unknown;
  };
  response: {
    body: unknown;
  };
}
export interface ILoggerInfoParams extends ILoggerCommonParams {}

export interface ILoggerErrorParams extends ILoggerCommonParams {
  errorCode: string;
  stack: string;
}

export interface ILogger {
  debug(message: unknown): void;
  info(message: ILoggerInfoParams): void;
  error(message: ILoggerErrorParams): void;
}
