import SatelliteModel, {
  GetSatelliteValidator,
  PostSatelliteValidator,
  PatchSatelliteValidator
} from './satellites.model';
import express from 'express';
import SatelliteService from './satellites.service';
import { Controller, Route, Validate } from '../../../src';
@Controller('/satellite')
class SatelliteController {
  exampleModel: SatelliteModel = {
    id: 101010,
    name: 'Sat Name',
    lat: 1234,
    lon: 1234,
    status: 'Example Satus',
    orbit: 'leo'
  };

  constructor(public satService = new SatelliteService()) {}

  @Route('GET', { applyHttpError: false })
  getAllSats() {
    return this.satService.getAll();
  }

  @Route('GET', { path: '/:id' })
  @Validate(new GetSatelliteValidator(), 'params')
  async getSatById({ params: { id } }: express.Request) {
    return this.satService.getOne(parseInt(id));
  }

  @Route('POST', { responseCode: 201 })
  @Validate(new PostSatelliteValidator(), 'body')
  addSat({ body: sat }: express.Request) {
    return this.satService.addOne({ ...sat, id: undefined });
  }

  @Route('PATCH')
  @Validate(new PatchSatelliteValidator(), 'body')
  async patchSat({ body: sat }: express.Request) {
    return this.satService.patchOne(sat);
  }

  @Route('GET', { path: '-api', applyHttpError: false })
  getModel() {
    return `<!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>TS Express Starter</title>
      </head>
      <body>
        <h1>SatModel Example:</h1>
        <h2>
        <pre>${JSON.stringify(this.exampleModel, null, 2)}<pre>
        </h2>
      </body>
      </html>`;
  }
}

export default SatelliteController;
