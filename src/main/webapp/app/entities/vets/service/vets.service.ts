import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVets, getVetsIdentifier } from '../vets.model';

export type EntityResponseType = HttpResponse<IVets>;
export type EntityArrayResponseType = HttpResponse<IVets[]>;

@Injectable({ providedIn: 'root' })
export class VetsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vets');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(vets: IVets): Observable<EntityResponseType> {
    return this.http.post<IVets>(this.resourceUrl, vets, { observe: 'response' });
  }

  update(vets: IVets): Observable<EntityResponseType> {
    return this.http.put<IVets>(`${this.resourceUrl}/${getVetsIdentifier(vets) as number}`, vets, { observe: 'response' });
  }

  partialUpdate(vets: IVets): Observable<EntityResponseType> {
    return this.http.patch<IVets>(`${this.resourceUrl}/${getVetsIdentifier(vets) as number}`, vets, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVets>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVets[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVetsToCollectionIfMissing(vetsCollection: IVets[], ...vetsToCheck: (IVets | null | undefined)[]): IVets[] {
    const vets: IVets[] = vetsToCheck.filter(isPresent);
    if (vets.length > 0) {
      const vetsCollectionIdentifiers = vetsCollection.map(vetsItem => getVetsIdentifier(vetsItem)!);
      const vetsToAdd = vets.filter(vetsItem => {
        const vetsIdentifier = getVetsIdentifier(vetsItem);
        if (vetsIdentifier == null || vetsCollectionIdentifiers.includes(vetsIdentifier)) {
          return false;
        }
        vetsCollectionIdentifiers.push(vetsIdentifier);
        return true;
      });
      return [...vetsToAdd, ...vetsCollection];
    }
    return vetsCollection;
  }
}
