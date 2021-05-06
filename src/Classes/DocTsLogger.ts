import { LoggerFn } from '..';

export class DocTsLogger {
  constructor(public log: LoggerFn = console.log) {}
}

export const docTsLogger = new DocTsLogger();
