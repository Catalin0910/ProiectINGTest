import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPets, getPetsIdentifier } from '../pets.model';

export type EntityResponseType = HttpResponse<IPets>;
export type EntityArrayResponseType = HttpResponse<IPets[]>;

@Injectable({ providedIn: 'root' })
export class PetsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pets');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pets: IPets): Observable<EntityResponseType> {
    return this.http.post<IPets>(this.resourceUrl, pets, { observe: 'response' });
  }

  update(pets: IPets): Observable<EntityResponseType> {
    return this.http.put<IPets>(`${this.resourceUrl}/${getPetsIdentifier(pets) as number}`, pets, { observe: 'response' });
  }

  partialUpdate(pets: IPets): Observable<EntityResponseType> {
    return this.http.patch<IPets>(`${this.resourceUrl}/${getPetsIdentifier(pets) as number}`, pets, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPets>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPets[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPetsToCollectionIfMissing(petsCollection: IPets[], ...petsToCheck: (IPets | null | undefined)[]): IPets[] {
    const pets: IPets[] = petsToCheck.filter(isPresent);
    if (pets.length > 0) {
      const petsCollectionIdentifiers = petsCollection.map(petsItem => getPetsIdentifier(petsItem)!);
      const petsToAdd = pets.filter(petsItem => {
        const petsIdentifier = getPetsIdentifier(petsItem);
        if (petsIdentifier == null || petsCollectionIdentifiers.includes(petsIdentifier)) {
          return false;
        }
        petsCollectionIdentifiers.push(petsIdentifier);
        return true;
      });
      return [...petsToAdd, ...petsCollection];
    }
    return petsCollection;
  }
}
