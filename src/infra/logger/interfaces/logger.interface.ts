export const LOGGER = Symbol('Logger');

export interface ILogger {
  debug(message: unknown): void;
  info(message: unknown): void;
  error(message: unknown): void;
}
