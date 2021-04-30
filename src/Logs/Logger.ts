import { LoggerFn } from '..';

export class DocTsLogger {
  constructor(public log: LoggerFn = console.log) {}
}

export const Logger = new DocTsLogger();
