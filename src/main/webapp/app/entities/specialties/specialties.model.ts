import { IVets } from 'app/entities/vets/vets.model';

export interface ISpecialties {
  id?: number;
  name?: string;
  vets?: IVets[] | null;
}

export class Specialties implements ISpecialties {
  constructor(public id?: number, public name?: string, public vets?: IVets[] | null) {}
}

export function getSpecialtiesIdentifier(specialties: ISpecialties): number | undefined {
  return specialties.id;
}
