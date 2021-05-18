import morgan from 'morgan';
import express from 'express';
import { DocApp, DocAppConfig } from '../../src';
import SatelliteController from './Satellites/satellites.controller';

const port = 5000;
const expressApp = express();
const config: DocAppConfig = {
  path: '/v1',
  showApi: true,
  router: express.Router(),
  expressApplication: expressApp,
  controllers: [new SatelliteController()],
  middleware: [express.json(), morgan('tiny')]
};

const appV1 = new DocApp(config);
const appV2 = new DocApp({ ...config, path: '/v2' });

expressApp.listen(port, () => {
  console.log(`DocApp listening on the port ${port}`);
  if (appV1.showApi) console.log(`View v1: http://localhost:${port}${appV1.path}`);
  if (appV2.showApi) console.log(`View v2: http://localhost:${port}${appV2.path}`);
});
