import express from 'express';
import { VaporApp } from '../../../../src';
import supertest, { SuperTest, Test } from 'supertest';
import SatelliteController from './satellites.controller';

const path = '/satellite';
const expressApp = express();
const satController = new SatelliteController();
let appRequest: SuperTest<Test>;

new VaporApp({
  showApi: false,
  controllers: [satController],
  middleware: [express.json()],
  expressApplication: expressApp
});

beforeAll(() => {
  appRequest = supertest(expressApp);
});

describe('/satellite', () => {
  describe('getAll', () => {
    it('gets all satellites', async () => {
      const { body: sats } = await appRequest.get(path).expect(200);
      expect(sats).toEqual(satController['satService'].satellites);
    });
  });

  describe('getting satellite by id', () => {
    it('gets a satellite by id', async () => {
      await appRequest.get(`${path}/0`).expect(200);
    });

    it('throws a 404 if the satellite does not exist', async () => {
      await appRequest.get(`${path}/100`).expect(404);
    });

    it('throws a 400 if an invalid sat id is passed', async () => {
      await appRequest.get(`${path}/I am an invalid id`).expect(400);
    });
  });

  describe('Creating a satellite', () => {
    it('creates a satellite if all fields are valid', async () => {
      const postSat = {
        name: 'New Satellite',
        lat: 10,
        lon: 10,
        orbit: 'leo',
        status: 'Awaiting Maneuver'
      };
      const { body } = await appRequest.post(path).send(postSat).expect(201);
      const { id, ...theRest } = body;
      expect(theRest).toEqual(postSat);
    });

    it('throws a 400 if any fields are missing', async () => {
      await appRequest
        .post(path)
        .send({
          name: 'Satellite'
        })
        .expect(400);
    });
  });

  describe('Patching a satellite', () => {
    it('patches a satellite', async () => {
      const { body: satToPatch } = await appRequest.get(`${path}/0`);
      satToPatch.name = 'Updated Name';

      const { body: patchedSat } = await appRequest.patch(path).send(satToPatch).expect(200);
      expect(satToPatch).toEqual(patchedSat);
    });

    it('throws a 400 if an invalid id is provided', async () => {
      await appRequest
        .patch(path)
        .send({
          name: 'Updated Sat',
          id: 'Id Should be a number.'
        })
        .expect(400);
    });

    it('throws a 404 if the id is not found', async () => {
      await appRequest
        .patch(path)
        .send({
          name: 'Updated Sat',
          id: 1000
        })
        .expect(404);
    });
  });

  describe('api', () => {
    it('returns the html for the example model', async () => {
      const { text, type } = await appRequest.get(`${path}/api`).expect(200);
      expect(type).toBe('text/html');
      expect(text).toContain(JSON.stringify(satController.exampleModel, null, 2));
    });
  });
});
