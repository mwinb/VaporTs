import SatelliteService from './satellites.service';

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
export default SatelliteModel;
