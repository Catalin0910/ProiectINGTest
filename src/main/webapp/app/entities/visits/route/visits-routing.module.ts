import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VisitsComponent } from '../list/visits.component';
import { VisitsDetailComponent } from '../detail/visits-detail.component';
import { VisitsUpdateComponent } from '../update/visits-update.component';
import { VisitsRoutingResolveService } from './visits-routing-resolve.service';

const visitsRoute: Routes = [
  {
    path: '',
    component: VisitsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VisitsDetailComponent,
    resolve: {
      visits: VisitsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VisitsUpdateComponent,
    resolve: {
      visits: VisitsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VisitsUpdateComponent,
    resolve: {
      visits: VisitsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(visitsRoute)],
  exports: [RouterModule],
})
export class VisitsRoutingModule {}
