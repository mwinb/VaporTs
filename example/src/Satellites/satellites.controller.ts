import SatelliteModel, {
  GetSatelliteValidator,
  PatchSatelliteValidator,
  PostSatelliteValidator
} from './satellites.model';
import morgan from 'morgan';
import express from 'express';
import SatelliteService from './satellites.service';
import { Controller, HttpError, Route, Validate } from '@mwinberry/doc-ts';
@Controller('/satellite', [morgan('tiny')])
class SatelliteController {
  exampleModel: SatelliteModel = { name: 'Sat Name', lat: 1234, lon: 1234, id: 101010, status: 'Example Satus' };

  constructor(public satService = new SatelliteService()) {}

  @Route('GET', { applyHttpError: false })
  getAllSats(_req: express.Request, res: express.Response) {
    res.send(this.satService.getAll());
  }

  @Route('POST')
  @Validate(new PostSatelliteValidator(), 'body')
  async addSat(req: express.Request, res: express.Response) {
    const sat = req.body;
    const newSat = this.satService.addOne({ ...sat, id: undefined });
    res.send(newSat);
  }

  @Route('PATCH')
  @Validate(new PatchSatelliteValidator(), 'body')
  async patchSat(req: express.Request, res: express.Response) {
    const sat = req.body;
    if (!this.satService.isValidSatId(sat.id)) {
      res.status(400).json({ message: 'Invalid Sat Id.' });
    }
    const patchedSat = this.satService.patchOne(sat);
    res.send(patchedSat);
  }

  @Route('GET', { path: '/:id' })
  @Validate(new GetSatelliteValidator(), 'params')
  getSatById(req: express.Request, res: express.Response) {
    const sat = this.satService.getOne(+req.params.id);
    if (!sat) throw new HttpError(404, 'Satellite not found.');
    res.json(sat);
  }

  @Route('GET', { path: '-api', applyHttpError: false })
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
