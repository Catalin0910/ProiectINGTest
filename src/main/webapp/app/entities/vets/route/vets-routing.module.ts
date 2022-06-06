import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VetsComponent } from '../list/vets.component';
import { VetsDetailComponent } from '../detail/vets-detail.component';
import { VetsUpdateComponent } from '../update/vets-update.component';
import { VetsRoutingResolveService } from './vets-routing-resolve.service';

const vetsRoute: Routes = [
  {
    path: '',
    component: VetsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VetsDetailComponent,
    resolve: {
      vets: VetsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VetsUpdateComponent,
    resolve: {
      vets: VetsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VetsUpdateComponent,
    resolve: {
      vets: VetsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(vetsRoute)],
  exports: [RouterModule],
})
export class VetsRoutingModule {}
