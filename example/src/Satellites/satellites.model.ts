import { Number, String } from '../../../src';
export type SatName = string;
export type SatLon = number;
export type SatLat = number;
export type SatId = number | undefined;
export type SatStatus = string;
export type IncomingSatModel = any;
interface SatelliteModel {
  id: SatId;
  name: SatName;
  lat: SatLat;
  lon: SatLon;
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
  status: SatStatus;
}

export class GetSatelliteValidator {
  @String({
    evaluators: [(arg: any) => !isNaN(parseInt(arg))]
  })
  id: SatId;
}

export default SatelliteModel;
