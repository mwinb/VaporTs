import { DocApp } from '@mwinberry/doc-ts';
import { VaporConfig } from '..';

export class VaporApp extends DocApp {
  constructor(config: VaporConfig) {
    super(config);
  }
}
