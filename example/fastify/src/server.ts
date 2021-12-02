import { VaporApp, VaporConfig } from '../../../src';
import SatelliteController from './Satellites/satellites.controller';
import fastify from 'fastify';
import middie from 'middie'
async function main() {
  const app = fastify();
  await app.register(middie);
 
  const port = 5000;
  const config: VaporConfig = {
    showApi: true,
    expressApplication: app,
    controllers: [new SatelliteController()],
  };
  const appV1 = new VaporApp(config);
  appV1.expressApplication.listen(port, () => {
    console.log(`VaporApp listening on the port ${port}`);
    if (appV1.showApi) console.log(`View v1: http://localhost:${port}${appV1.path}`);
  });
}
main();
