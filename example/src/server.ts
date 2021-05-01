import express from 'express';
import { DocApp } from '@mwinberry/doc-ts';
import SatelliteController from './Satellites/satellites.controller';

const port = 5000;
const expressApp = express();
const appV1 = new DocApp({
  path: '/v1',
  showApi: true,
  controllers: [new SatelliteController()],
  expressApplication: expressApp,
  router: express.Router(),
  middleware: [express.json()]
});

expressApp.listen(port, () => {
  console.log(`App listening on the port ${port}`);
  if (appV1.showApi) console.log(`View v1: http://localhost:${port}${appV1.path}`);
});
