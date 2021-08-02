import sats from './satellites.json';
import { HttpError } from 'vaports';
import SatelliteModel, { SatId } from './satellites.model';

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

  throwIfNotFound(id: SatId): void {
    if (!(id <= this.satCount && id >= 0)) {
      throw new HttpError(404, `A satellite with the id: ${id} does not exist.`);
    }
  }

  getAll(): SatelliteModel[] {
    return this.satellites;
  }

  getOne(id: SatId): SatelliteModel {
    this.throwIfNotFound(id);
    return this.satellites[id];
  }

  addOne(newSat: SatelliteModel): SatelliteModel {
    newSat.id = this.satellites.length;
    this.satellites.push(newSat);
    return newSat;
  }

  patchOne(newSat: SatelliteModel): SatelliteModel {
    this.throwIfNotFound(newSat.id);
    const patchedSat = { ...this.satellites[newSat.id], ...newSat };
    this.satellites[newSat.id] = patchedSat;
    return patchedSat;
  }
}

export default SatelliteService;
