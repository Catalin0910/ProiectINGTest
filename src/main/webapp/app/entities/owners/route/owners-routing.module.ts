import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OwnersComponent } from '../list/owners.component';
import { OwnersDetailComponent } from '../detail/owners-detail.component';
import { OwnersUpdateComponent } from '../update/owners-update.component';
import { OwnersRoutingResolveService } from './owners-routing-resolve.service';

const ownersRoute: Routes = [
  {
    path: '',
    component: OwnersComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OwnersDetailComponent,
    resolve: {
      owners: OwnersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OwnersUpdateComponent,
    resolve: {
      owners: OwnersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OwnersUpdateComponent,
    resolve: {
      owners: OwnersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ownersRoute)],
  exports: [RouterModule],
})
export class OwnersRoutingModule {}
