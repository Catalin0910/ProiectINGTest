import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVets, Vets } from '../vets.model';
import { VetsService } from '../service/vets.service';

@Injectable({ providedIn: 'root' })
export class VetsRoutingResolveService implements Resolve<IVets> {
  constructor(protected service: VetsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVets> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vets: HttpResponse<Vets>) => {
          if (vets.body) {
            return of(vets.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Vets());
  }
}
