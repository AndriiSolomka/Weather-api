export interface LoggerInterface {
  info(data: Record<string, unknown>): void;
  error(data: Record<string, unknown>): void;
  warn(data: Record<string, unknown>): void;
  debug(data: Record<string, unknown>): void;
  trace(data: Record<string, unknown>): void;
}
