import morgan from 'morgan';
import express from 'express';
import { DocApp, DocAppConfig } from '@mwinberry/doc-ts';
import SatelliteController from './Satellites/satellites.controller';

const port = 5000;
const config: DocAppConfig = {
  showApi: true,
  expressApplication: express(),
  controllers: [new SatelliteController()],
  middleware: [express.json(), morgan('combined')]
};

const appV1 = new DocApp(config);
const appV2 = new DocApp({ ...config, path: '/v2' });

appV1.expressApplication.listen(port, () => {
  console.log(`DocApp listening on the port ${port}`);
  if (appV1.showApi) console.log(`View v1: http://localhost:${port}${appV1.path}`);
  if (appV2.showApi) console.log(`View v2: http://localhost:${port}${appV2.path}`);
});
