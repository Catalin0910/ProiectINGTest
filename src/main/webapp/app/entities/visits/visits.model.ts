import dayjs from 'dayjs/esm';
import { IPets } from 'app/entities/pets/pets.model';

export interface IVisits {
  id?: number;
  visitdate?: dayjs.Dayjs;
  description?: string;
  pet?: IPets | null;
}

export class Visits implements IVisits {
  constructor(public id?: number, public visitdate?: dayjs.Dayjs, public description?: string, public pet?: IPets | null) {}
}

export function getVisitsIdentifier(visits: IVisits): number | undefined {
  return visits.id;
}
