import { Application, Router } from 'express';

export interface DocAppConfig {
  path?: string;
  showApi?: boolean;
  controllers?: Record<string, any>[];
  middleware?: any[];
  app: Application;
  router: Router;
}
