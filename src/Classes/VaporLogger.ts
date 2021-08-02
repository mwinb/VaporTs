import { LoggerFn } from '..';

export class VaporLogger {
  public prefix: string;
  constructor(private loggerFn: LoggerFn = console.log) {
    this.prefix = 'VaporTs';
  }

  log(message?: any, ...optionalParams: any[]): void {
    this.loggerFn(`[${new Date().toISOString()}] ${this.prefix}: ${message}`, ...optionalParams);
  }
}

export const vaporLogger = new VaporLogger();
