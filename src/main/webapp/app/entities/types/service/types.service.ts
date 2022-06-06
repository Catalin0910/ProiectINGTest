import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypes, getTypesIdentifier } from '../types.model';

export type EntityResponseType = HttpResponse<ITypes>;
export type EntityArrayResponseType = HttpResponse<ITypes[]>;

@Injectable({ providedIn: 'root' })
export class TypesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(types: ITypes): Observable<EntityResponseType> {
    return this.http.post<ITypes>(this.resourceUrl, types, { observe: 'response' });
  }

  update(types: ITypes): Observable<EntityResponseType> {
    return this.http.put<ITypes>(`${this.resourceUrl}/${getTypesIdentifier(types) as number}`, types, { observe: 'response' });
  }

  partialUpdate(types: ITypes): Observable<EntityResponseType> {
    return this.http.patch<ITypes>(`${this.resourceUrl}/${getTypesIdentifier(types) as number}`, types, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypes>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypes[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypesToCollectionIfMissing(typesCollection: ITypes[], ...typesToCheck: (ITypes | null | undefined)[]): ITypes[] {
    const types: ITypes[] = typesToCheck.filter(isPresent);
    if (types.length > 0) {
      const typesCollectionIdentifiers = typesCollection.map(typesItem => getTypesIdentifier(typesItem)!);
      const typesToAdd = types.filter(typesItem => {
        const typesIdentifier = getTypesIdentifier(typesItem);
        if (typesIdentifier == null || typesCollectionIdentifiers.includes(typesIdentifier)) {
          return false;
        }
        typesCollectionIdentifiers.push(typesIdentifier);
        return true;
      });
      return [...typesToAdd, ...typesCollection];
    }
    return typesCollection;
  }
}
