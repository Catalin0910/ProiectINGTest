import { IVisits } from 'app/entities/visits/visits.model';
import { ITypes } from 'app/entities/types/types.model';
import { IOwners } from 'app/entities/owners/owners.model';

export interface IPets {
  id?: number;
  name?: string;
  birthdate?: string;
  visits?: IVisits[] | null;
  type?: ITypes | null;
  owner?: IOwners | null;
}

export class Pets implements IPets {
  constructor(
    public id?: number,
    public name?: string,
    public birthdate?: string,
    public visits?: IVisits[] | null,
    public type?: ITypes | null,
    public owner?: IOwners | null
  ) {}
}

export function getPetsIdentifier(pets: IPets): number | undefined {
  return pets.id;
}
