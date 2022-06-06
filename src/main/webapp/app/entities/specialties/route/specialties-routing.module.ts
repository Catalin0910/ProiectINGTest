import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SpecialtiesComponent } from '../list/specialties.component';
import { SpecialtiesDetailComponent } from '../detail/specialties-detail.component';
import { SpecialtiesUpdateComponent } from '../update/specialties-update.component';
import { SpecialtiesRoutingResolveService } from './specialties-routing-resolve.service';

const specialtiesRoute: Routes = [
  {
    path: '',
    component: SpecialtiesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SpecialtiesDetailComponent,
    resolve: {
      specialties: SpecialtiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SpecialtiesUpdateComponent,
    resolve: {
      specialties: SpecialtiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SpecialtiesUpdateComponent,
    resolve: {
      specialties: SpecialtiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(specialtiesRoute)],
  exports: [RouterModule],
})
export class SpecialtiesRoutingModule {}
