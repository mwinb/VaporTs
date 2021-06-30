import { LoggerFn } from '..';

export class DocTsLogger {
  constructor(private loggerFn: LoggerFn = console.log) {}

  get log() {
    return this.loggerFn;
  }

  set log(newLogger: LoggerFn) {
    this.loggerFn = newLogger;
  }
}

export const docTsLogger = new DocTsLogger();
