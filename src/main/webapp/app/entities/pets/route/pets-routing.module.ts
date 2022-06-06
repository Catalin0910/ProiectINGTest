import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PetsComponent } from '../list/pets.component';
import { PetsDetailComponent } from '../detail/pets-detail.component';
import { PetsUpdateComponent } from '../update/pets-update.component';
import { PetsRoutingResolveService } from './pets-routing-resolve.service';

const petsRoute: Routes = [
  {
    path: '',
    component: PetsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PetsDetailComponent,
    resolve: {
      pets: PetsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PetsUpdateComponent,
    resolve: {
      pets: PetsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PetsUpdateComponent,
    resolve: {
      pets: PetsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(petsRoute)],
  exports: [RouterModule],
})
export class PetsRoutingModule {}
