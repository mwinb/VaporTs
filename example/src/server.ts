import { DocApp } from '../../src/Classes/DocApp';
import express from 'express';
import SatelliteController from './Satellites/satellites.controller';

const port = 5000;
const app = new DocApp({
  controllers: [new SatelliteController()],
  app: express(),
  router: express.Router()
});
app.app.listen(port, () => {
  console.log(`App listening on the port ${port}`);
  if (app.showApi) console.log(`View: http://localhost:${port}${app.path}`);
});
