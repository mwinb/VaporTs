import express from 'express';
import SatelliteService from './satellites.service';
import SatelliteModel from './satellites.model';
import morgan from 'morgan';
import { Controller, Route } from '../../../src';
@Controller('/satellite', [morgan('tiny')])
class SatelliteController {
  exampleModel: SatelliteModel = { name: 'Sat Name', lat: 1234, lon: 1234, id: 101010, status: 'Example Satus' };

  constructor(public satService = new SatelliteService()) {}

  @Route('GET')
  getAllSats(_req: express.Request, res: express.Response) {
    res.send(this.satService.getAll());
  }

  @Route('POST')
  addSat(req: express.Request, res: express.Response) {
    const sat = req.body;
    if (!this.satService.canCreateSatellite(sat)) {
      res.status(400).json({ message: 'Invalid properties provided.' });
    }
    try {
      const newSat = this.satService.addOne({ ...sat, id: undefined });
      res.send(newSat);
    } catch {
      res.sendStatus(500);
    }
  }

  @Route('PATCH')
  patchSat(req: express.Request, res: express.Response) {
    const sat = req.body;
    if (!this.satService.canPatchSatellite(sat)) {
      res.status(400).json({ message: 'Invalid properties provided.' });
    }
    try {
      const patchedSat = this.satService.patchOne(sat);
      res.send(patchedSat);
    } catch {
      res.sendStatus(500);
    }
  }

  @Route('GET', { path: '/:id' })
  getSatById(req: express.Request, res: express.Response) {
    const { id } = req.params;
    if (!this.satService.isValidSatId(+id)) res.status(404).json({ message: 'Satellite not found.' });
    try {
      res.json(this.satService.getOne(+id));
    } catch {
      res.sendStatus(500);
    }
  }

  @Route('GET', { path: '-api' })
  getModel(_req: express.Request, res: express.Response) {
    res.send(
      `<!doctype html>
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
      </html>`
    );
  }
}

export default SatelliteController;
