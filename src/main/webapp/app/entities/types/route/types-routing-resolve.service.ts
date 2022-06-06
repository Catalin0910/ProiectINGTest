import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypes, Types } from '../types.model';
import { TypesService } from '../service/types.service';

@Injectable({ providedIn: 'root' })
export class TypesRoutingResolveService implements Resolve<ITypes> {
  constructor(protected service: TypesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypes> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((types: HttpResponse<Types>) => {
          if (types.body) {
            return of(types.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Types());
  }
}
