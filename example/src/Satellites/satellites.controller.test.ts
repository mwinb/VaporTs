import SatelliteModel from './satellites.model';
import SatelliteService from './satellites.service';
import SatelliteController from './satellites.controller';

let mockResponse: any;
let mockRequest: any;
let satController: SatelliteController;

beforeEach(() => {
  mockResponse = {
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };
  mockRequest = {};

  satController = new SatelliteController();
});
describe('Satellites Controller', () => {
  it('should get all satellites', () => {
    satController.getAllSats(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalledWith(satController.satService.satellites);
  });

  describe('Adding Satellite', () => {
    it('can add a satellite', async () => {
      mockRequest = { body: { name: 'Sat Name', lat: 1234, lon: 1234, status: 'Example Status' } };
      await satController.addSat(mockRequest, mockResponse);
      expect(mockResponse.send).toHaveBeenCalledWith({
        id: 3,
        lat: 1234,
        lon: 1234,
        name: 'Sat Name',
        status: 'Example Status'
      });
    });

    it('should send a 400 with a failure message if the required fields are not provided when adding a satellite', async () => {
      mockRequest = { body: {} };
      await satController.addSat(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
  describe('patching satellite', () => {
    let satToPatch: SatelliteModel;
    beforeEach(() => {
      satToPatch = satController.satService.satellites[0];
    });
    it('can patch a satellite', async () => {
      satToPatch.name = 'New Name';
      mockRequest.body = satToPatch;
      await satController.patchSat(mockRequest, mockResponse);
      expect(mockResponse.send).toHaveBeenCalledWith(satToPatch);
    });

    it('returns a 400 if the patch data id is invalid', async () => {
      satToPatch.id = 1010101010101010101010;
      mockRequest.body = satToPatch;
      satController.patchSat(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('returns a 400 if the patch data does not contain one of the required fields', () => {
      mockRequest.body = {};
      satController.patchSat(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Getting Satellite by id', () => {
    let requestedSatellite: SatelliteModel;
    beforeEach(() => {
      requestedSatellite = satController.satService.satellites[0];
    });
    it('can get a satellite by id', () => {
      mockRequest.params = { id: requestedSatellite.id.toString() };
      satController.getSatById(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(requestedSatellite);
    });

    it('responds with a 404 if the sat id is not found', () => {
      mockRequest.params = { id: '10101010' };
      satController.getSatById(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenLastCalledWith(404);
    });
  });

  it('serves the model html', () => {
    satController.getModel(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });
});
