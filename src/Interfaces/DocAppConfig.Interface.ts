import { Application, Router } from 'express';
import { LoggerFn } from '../Types/LoggerFn.Type';

export interface DocAppConfig {
  path?: string;
  showApi?: boolean;
  middleware?: any[];
  logger?: LoggerFn;
  controllers: Record<string, any>[];
  expressApplication: Application;
  router: Router;
}
