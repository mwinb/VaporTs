import { String, Number } from '../../../src';
import { stringIsInteger } from '../Evaluators/stringIsInteger';
import { SatName, SatLat, SatLon, orbit, SatStatus, SatId } from '../Satellites/satellites.model';

class PostSatelliteValidator {
  @String()
  name: SatName;

  @Number()
  lat: SatLat;

  @Number()
  lon: SatLon;

  @String()
  orbit: orbit;

  @String()
  status: SatStatus;
}

class PatchSatelliteValidator {
  @Number()
  id: SatId;

  @String({ optional: true })
  name: SatName;

  @Number({ optional: true })
  lat: SatLat;

  @Number({ optional: true })
  lon: SatLon;

  @String({ optional: true })
  orbit: orbit;

  @String({ optional: true })
  status: SatStatus;
}

class GetSatelliteValidator {
  @String({
    evaluators: [stringIsInteger]
  })
  id: SatId;
}
export const postSatelliteValidator = new PostSatelliteValidator();
export const getSatelliteValidator = new GetSatelliteValidator();
export const patchSatelliteValidator = new PatchSatelliteValidator();
