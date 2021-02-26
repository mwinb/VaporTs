import SatelliteModel, { IncomingSatModel, SatId } from './satellites.model';
import sats from './satellites.json';

class SatelliteService {
  satellites: SatelliteModel[] = [];

  constructor() {
    this.satellites = sats.map((sat, i) => {
      return { ...sat, id: i };
    });
  }

  get satCount(): number {
    return this.satellites.length - 1;
  }

  isValidSatId = (id: SatId): boolean => id <= this.satCount && id >= 0;

  canCreateSatellite = (incoming: IncomingSatModel): boolean => {
    const { name, lat, lon, status } = incoming;
    return name && lat && lon && status;
  };

  canPatchSatellite = (incoming: IncomingSatModel): boolean => {
    const { name, lat, lon, status, id } = incoming;
    return this.isValidSatId(id) && (name || lat || lon || status);
  };

  getAll(): SatelliteModel[] {
    return this.satellites;
  }

  getOne(id: SatId): SatelliteModel {
    return this.satellites[id];
  }

  addOne(newSat: SatelliteModel): SatelliteModel {
    newSat.id = this.satellites.length;
    this.satellites.push(newSat);
    return newSat;
  }

  patchOne(newSat: SatelliteModel): SatelliteModel {
    const oldSat = this.satellites[newSat.id];
    const patchedSat = { ...oldSat, ...newSat };
    this.satellites[newSat.id] = patchedSat;
    return patchedSat;
  }
}

export default SatelliteService;