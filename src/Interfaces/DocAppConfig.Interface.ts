import { Application } from 'express';

export interface DocAppConfig {
  path?: string;
  showApi?: boolean;
  middleware?: any[];
  controllers: Record<string, any>[];
  expressApplication: Application;
}
