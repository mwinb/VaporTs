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

export default SatelliteModel;
