import express from 'express';
import {
  postSatelliteValidator,
  patchSatelliteValidator,
  getSatelliteValidator
} from '../Validators/SatelliteValidators';
import SatelliteModel from './satellites.model';
import SatelliteService from './satellites.service';
import { Controller, Route, Validate } from 'vaports';
import jsonContentValidator from '../Validators/JsonContentValidator';

@Controller('satellite')
class SatelliteController {
  exampleModel: SatelliteModel = {
    id: 1000,
    name: 'Sat Name',
    lat: 1234,
    lon: 1234,
    orbit: 'leo',
    status: 'Example Status'
  };

  constructor(public satService = new SatelliteService()) {}

  @Route('GET', { responseCode: 200 })
  async getAllSats(): Promise<SatelliteModel[]> {
    return this.satService.getAll();
  }

  @Route('GET', { path: '/:id' })
  @Validate(getSatelliteValidator, 'params')
  async getSatById({ params: { id } }: express.Request): Promise<SatelliteModel> {
    return this.satService.getOne(+id);
  }

  @Route('POST', { responseCode: 201 })
  @Validate(postSatelliteValidator, 'body')
  @Validate(jsonContentValidator, 'headers', { strip: false })
  async addSat({ body: sat }: express.Request): Promise<SatelliteModel> {
    return this.satService.addOne(sat);
  }

  @Route('PATCH')
  @Validate(patchSatelliteValidator, 'body')
  @Validate(jsonContentValidator, 'headers', { strip: false })
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
