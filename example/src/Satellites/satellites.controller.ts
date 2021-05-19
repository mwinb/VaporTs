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
    id: 1000,
    name: 'Sat Name',
    lat: 1234,
    lon: 1234,
    status: 'Example Satus',
    orbit: 'leo'
  };

  constructor(public satService = new SatelliteService()) {}

  @Route('GET')
  async getAllSats(): Promise<SatelliteModel[]> {
    return this.satService.getAll();
  }

  @Route('GET', { path: '/:id' })
  @Validate(new GetSatelliteValidator(), 'params')
  async getSatById({ params: { id } }: express.Request): Promise<SatelliteModel> {
    return this.satService.getOne(parseInt(id));
  }

  @Route('POST', { responseCode: 201 })
  @Validate(new PostSatelliteValidator(), 'body')
  async addSat({ body: sat }: express.Request): Promise<SatelliteModel> {
    return this.satService.addOne({ ...sat, id: undefined });
  }

  @Route('PATCH')
  @Validate(new PatchSatelliteValidator(), 'body')
  async patchSat({ body: sat }: express.Request): Promise<SatelliteModel> {
    return this.satService.patchOne(sat);
  }

  @Route('GET', { path: '-api', handleErrors: false })
  getModel() {
    return `<!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>DocTS Example</title>
      </head>
      <body>
        <h1>Satellite Example:</h1>
        <h2>
        <pre>${JSON.stringify(this.exampleModel, null, 2)}<pre>
        </h2>
      </body>
      </html>`;
  }
}

export default SatelliteController;
