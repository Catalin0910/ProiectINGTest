import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOwners, Owners } from '../owners.model';
import { OwnersService } from '../service/owners.service';

@Injectable({ providedIn: 'root' })
export class OwnersRoutingResolveService implements Resolve<IOwners> {
  constructor(protected service: OwnersService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOwners> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((owners: HttpResponse<Owners>) => {
          if (owners.body) {
            return of(owners.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Owners());
  }
}
