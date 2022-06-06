import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPets, Pets } from '../pets.model';
import { PetsService } from '../service/pets.service';

@Injectable({ providedIn: 'root' })
export class PetsRoutingResolveService implements Resolve<IPets> {
  constructor(protected service: PetsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPets> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pets: HttpResponse<Pets>) => {
          if (pets.body) {
            return of(pets.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Pets());
  }
}
