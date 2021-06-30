import { LoggerFn } from '..';

export class DocLogger {
  constructor(private loggerFn: LoggerFn = console.log) {}

  get log() {
    return this.loggerFn;
  }

  set log(newLogger: LoggerFn) {
    this.loggerFn = newLogger;
  }
}

export const docLogger = new DocLogger();
