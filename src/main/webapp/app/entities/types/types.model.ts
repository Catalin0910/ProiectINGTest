export interface ITypes {
  id?: number;
  name?: string;
}

export class Types implements ITypes {
  constructor(public id?: number, public name?: string) {}
}

export function getTypesIdentifier(types: ITypes): number | undefined {
  return types.id;
}
