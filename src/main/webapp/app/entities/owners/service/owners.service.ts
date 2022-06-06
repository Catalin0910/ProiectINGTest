import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOwners, getOwnersIdentifier } from '../owners.model';

export type EntityResponseType = HttpResponse<IOwners>;
export type EntityArrayResponseType = HttpResponse<IOwners[]>;

@Injectable({ providedIn: 'root' })
export class OwnersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/owners');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(owners: IOwners): Observable<EntityResponseType> {
    return this.http.post<IOwners>(this.resourceUrl, owners, { observe: 'response' });
  }

  update(owners: IOwners): Observable<EntityResponseType> {
    return this.http.put<IOwners>(`${this.resourceUrl}/${getOwnersIdentifier(owners) as number}`, owners, { observe: 'response' });
  }

  partialUpdate(owners: IOwners): Observable<EntityResponseType> {
    return this.http.patch<IOwners>(`${this.resourceUrl}/${getOwnersIdentifier(owners) as number}`, owners, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOwners>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOwners[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOwnersToCollectionIfMissing(ownersCollection: IOwners[], ...ownersToCheck: (IOwners | null | undefined)[]): IOwners[] {
    const owners: IOwners[] = ownersToCheck.filter(isPresent);
    if (owners.length > 0) {
      const ownersCollectionIdentifiers = ownersCollection.map(ownersItem => getOwnersIdentifier(ownersItem)!);
      const ownersToAdd = owners.filter(ownersItem => {
        const ownersIdentifier = getOwnersIdentifier(ownersItem);
        if (ownersIdentifier == null || ownersCollectionIdentifiers.includes(ownersIdentifier)) {
          return false;
        }
        ownersCollectionIdentifiers.push(ownersIdentifier);
        return true;
      });
      return [...ownersToAdd, ...ownersCollection];
    }
    return ownersCollection;
  }
}
