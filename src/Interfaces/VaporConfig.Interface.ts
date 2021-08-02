import { Application } from 'express';

export interface VaporConfig {
  path?: string;
  showApi?: boolean;
  middleware?: any[];
  controllers: Record<string, any>[];
  expressApplication: Application;
}
