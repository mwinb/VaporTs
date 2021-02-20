import SatelliteModel, { IncomingSatModel, SatId } from './satellites.model';
import sats from './sattelites.json';

class SatelliteService {
  sattelites: SatelliteModel[] = [];

  constructor() {
    this.sattelites = sats.map((sat, i) => {
      return { ...sat, id: i };
    });
  }

  get satCount(): number {
    return this.sattelites.length - 1;
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
    return this.sattelites;
  }

  getOne(id: SatId): SatelliteModel {
    return this.sattelites[id];
  }

  addOne(newSat: SatelliteModel): SatelliteModel {
    newSat.id = this.sattelites.length;
    this.sattelites.push(newSat);
    return newSat;
  }

  patchOne(newSat: SatelliteModel): SatelliteModel {
    const oldSat = this.sattelites[newSat.id];
    const patchedSat = { ...oldSat, ...newSat };
    this.sattelites[newSat.id] = patchedSat;
    return patchedSat;
  }
}

export default SatelliteService;
