import { ExpressLikeApp } from '..';

export interface VaporConfig {
  path?: string;
  showApi?: boolean;
  middleware?: any[];
  expressApplication: ExpressLikeApp;
  controllers: Record<string, any>[];
}
