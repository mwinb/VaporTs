import morgan from 'morgan';
import express from 'express';
import { VaporApp, VaporConfig } from '../../../src';
import SatelliteController from './Satellites/satellites.controller';

const port = 5000;
const config: VaporConfig = {
  showApi: true,
  expressApplication: express(),
  controllers: [new SatelliteController()],
  middleware: [express.json()]
};

const appV1 = new VaporApp(config);
const appV2 = new VaporApp({ ...config, path: '/v2' });

appV1.expressApplication.listen(port, () => {
  console.log(`VaporTs listening on the port ${port}`);
  if (appV1.showApi) console.log(`View v1: http://localhost:${port}${appV1.path}`);
  if (appV2.showApi) console.log(`View v2: http://localhost:${port}${appV2.path}`);
});
