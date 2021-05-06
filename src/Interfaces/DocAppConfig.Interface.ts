import { LoggerFn } from '..';
import { Application, Router } from 'express';

export interface DocAppConfig {
  path?: string;
  showApi?: boolean;
  middleware?: any[];
  logger?: LoggerFn;
  controllers: Record<string, any>[];
  expressApplication: Application;
  router: Router;
}
