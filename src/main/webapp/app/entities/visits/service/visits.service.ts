import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVisits, getVisitsIdentifier } from '../visits.model';

export type EntityResponseType = HttpResponse<IVisits>;
export type EntityArrayResponseType = HttpResponse<IVisits[]>;

@Injectable({ providedIn: 'root' })
export class VisitsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/visits');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(visits: IVisits): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(visits);
    return this.http
      .post<IVisits>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(visits: IVisits): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(visits);
    return this.http
      .put<IVisits>(`${this.resourceUrl}/${getVisitsIdentifier(visits) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(visits: IVisits): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(visits);
    return this.http
      .patch<IVisits>(`${this.resourceUrl}/${getVisitsIdentifier(visits) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IVisits>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IVisits[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVisitsToCollectionIfMissing(visitsCollection: IVisits[], ...visitsToCheck: (IVisits | null | undefined)[]): IVisits[] {
    const visits: IVisits[] = visitsToCheck.filter(isPresent);
    if (visits.length > 0) {
      const visitsCollectionIdentifiers = visitsCollection.map(visitsItem => getVisitsIdentifier(visitsItem)!);
      const visitsToAdd = visits.filter(visitsItem => {
        const visitsIdentifier = getVisitsIdentifier(visitsItem);
        if (visitsIdentifier == null || visitsCollectionIdentifiers.includes(visitsIdentifier)) {
          return false;
        }
        visitsCollectionIdentifiers.push(visitsIdentifier);
        return true;
      });
      return [...visitsToAdd, ...visitsCollection];
    }
    return visitsCollection;
  }

  protected convertDateFromClient(visits: IVisits): IVisits {
    return Object.assign({}, visits, {
      visitdate: visits.visitdate?.isValid() ? visits.visitdate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.visitdate = res.body.visitdate ? dayjs(res.body.visitdate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((visits: IVisits) => {
        visits.visitdate = visits.visitdate ? dayjs(visits.visitdate) : undefined;
      });
    }
    return res;
  }
}
