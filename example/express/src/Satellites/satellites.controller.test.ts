import { Request } from 'express';
import SatelliteModel from './satellites.model';
import SatelliteController from './satellites.controller';

let mockRequest: Request;
let satController: SatelliteController;

beforeEach(() => {
  mockRequest = {} as Request;
  satController = new SatelliteController();
});
describe('Satellites Controller', () => {
  it('should get all satellites', async () => {
    const sats = await satController.getAllSats();
    expect(sats).toEqual(satController.satService.satellites);
  });

  describe('Getting Satellite by id', () => {
    let requestedSatellite: SatelliteModel;
    beforeEach(() => {
      requestedSatellite = satController.satService.satellites[0];
    });
    it('can get a satellite by id', async () => {
      mockRequest.params = { id: requestedSatellite.id.toString() };
      const sat = await satController.getSatById(mockRequest);
      expect(sat).toEqual(requestedSatellite);
    });

    it('throws a 404 HttpError if the satellite is not found', async () => {
      mockRequest.params = { id: '10101010' };
      let errorThrown;
      try {
        await satController.getSatById(mockRequest);
      } catch (error) {
        errorThrown = error;
      }
      expect(errorThrown.code).toBe(404);
    });
  });

  describe('Adding Satellite', () => {
    it('can add a satellite', async () => {
      mockRequest = { body: { name: 'Sat Name', lat: 1234, lon: 1234, status: 'Example Status' } } as Request;
      const newSat = await satController.addSat(mockRequest);
      expect(newSat).toEqual({
        id: 3,
        lat: 1234,
        lon: 1234,
        name: 'Sat Name',
        status: 'Example Status'
      });
    });
  });
  describe('patching satellite', () => {
    let satToPatch: SatelliteModel;
    beforeEach(() => {
      satToPatch = satController.satService.satellites[0];
    });
    it('returns the patched satellite', async () => {
      satToPatch.name = 'New Name';
      mockRequest.body = satToPatch;
      const patchedSat = await satController.patchSat(mockRequest);
      expect(patchedSat.name).toEqual(satToPatch.name);
    });

    it('throws an HttpError with a 404 code if the satellite is not found.', async () => {
      satToPatch.id = 100;
      mockRequest.body = satToPatch;
      let thrownError;
      try {
        await satController.patchSat(mockRequest);
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError.code).toBe(404);
    });
  });

  it('serves the model html', () => {
    const modelHtml = satController.getModel();
    expect(modelHtml).toContain(JSON.stringify(satController.exampleModel, null, 2));
  });
});
