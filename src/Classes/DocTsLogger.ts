import { LoggerFn } from '..';

export class DocLogger {
  public prefix: string;
  constructor(private loggerFn: LoggerFn = console.log) {
    this.prefix = 'DocTs';
  }

  log(message?: any, ...optionalParams: any[]): void {
    this.loggerFn(`[${new Date().toISOString()}] ${this.prefix}: ${message}`, ...optionalParams);
  }
}

export const docLogger = new DocLogger();
