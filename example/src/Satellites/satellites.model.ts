import { Number, String } from '../../../src';
import { satIdEvaluator } from '../Evaluators/satIdEvaluator';
export type orbit = string;
export type SatLon = number;
export type SatLat = number;
export type SatName = string;
export type SatStatus = string;
export type IncomingSatModel = any;
export type SatId = number | undefined;
interface SatelliteModel {
  id: SatId;
  lat: SatLat;
  lon: SatLon;
  orbit: orbit;
  name: SatName;
  status: SatStatus;
}

export class PostSatelliteValidator {
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

export class PatchSatelliteValidator {
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
export class GetSatelliteValidator {
  @String({
    evaluators: [satIdEvaluator]
  })
  id: SatId;
}

export default SatelliteModel;
