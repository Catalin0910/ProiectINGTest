import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'vets',
        data: { pageTitle: 'ingTestProiectApp.vets.home.title' },
        loadChildren: () => import('./vets/vets.module').then(m => m.VetsModule),
      },
      {
        path: 'specialties',
        data: { pageTitle: 'ingTestProiectApp.specialties.home.title' },
        loadChildren: () => import('./specialties/specialties.module').then(m => m.SpecialtiesModule),
      },
      {
        path: 'types',
        data: { pageTitle: 'ingTestProiectApp.types.home.title' },
        loadChildren: () => import('./types/types.module').then(m => m.TypesModule),
      },
      {
        path: 'owners',
        data: { pageTitle: 'ingTestProiectApp.owners.home.title' },
        loadChildren: () => import('./owners/owners.module').then(m => m.OwnersModule),
      },
      {
        path: 'pets',
        data: { pageTitle: 'ingTestProiectApp.pets.home.title' },
        loadChildren: () => import('./pets/pets.module').then(m => m.PetsModule),
      },
      {
        path: 'visits',
        data: { pageTitle: 'ingTestProiectApp.visits.home.title' },
        loadChildren: () => import('./visits/visits.module').then(m => m.VisitsModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
