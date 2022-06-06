import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISpecialties, getSpecialtiesIdentifier } from '../specialties.model';

export type EntityResponseType = HttpResponse<ISpecialties>;
export type EntityArrayResponseType = HttpResponse<ISpecialties[]>;

@Injectable({ providedIn: 'root' })
export class SpecialtiesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/specialties');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(specialties: ISpecialties): Observable<EntityResponseType> {
    return this.http.post<ISpecialties>(this.resourceUrl, specialties, { observe: 'response' });
  }

  update(specialties: ISpecialties): Observable<EntityResponseType> {
    return this.http.put<ISpecialties>(`${this.resourceUrl}/${getSpecialtiesIdentifier(specialties) as number}`, specialties, {
      observe: 'response',
    });
  }

  partialUpdate(specialties: ISpecialties): Observable<EntityResponseType> {
    return this.http.patch<ISpecialties>(`${this.resourceUrl}/${getSpecialtiesIdentifier(specialties) as number}`, specialties, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISpecialties>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISpecialties[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSpecialtiesToCollectionIfMissing(
    specialtiesCollection: ISpecialties[],
    ...specialtiesToCheck: (ISpecialties | null | undefined)[]
  ): ISpecialties[] {
    const specialties: ISpecialties[] = specialtiesToCheck.filter(isPresent);
    if (specialties.length > 0) {
      const specialtiesCollectionIdentifiers = specialtiesCollection.map(specialtiesItem => getSpecialtiesIdentifier(specialtiesItem)!);
      const specialtiesToAdd = specialties.filter(specialtiesItem => {
        const specialtiesIdentifier = getSpecialtiesIdentifier(specialtiesItem);
        if (specialtiesIdentifier == null || specialtiesCollectionIdentifiers.includes(specialtiesIdentifier)) {
          return false;
        }
        specialtiesCollectionIdentifiers.push(specialtiesIdentifier);
        return true;
      });
      return [...specialtiesToAdd, ...specialtiesCollection];
    }
    return specialtiesCollection;
  }
}
