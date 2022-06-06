import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SpecialtiesComponent } from './list/specialties.component';
import { SpecialtiesDetailComponent } from './detail/specialties-detail.component';
import { SpecialtiesUpdateComponent } from './update/specialties-update.component';
import { SpecialtiesDeleteDialogComponent } from './delete/specialties-delete-dialog.component';
import { SpecialtiesRoutingModule } from './route/specialties-routing.module';

@NgModule({
  imports: [SharedModule, SpecialtiesRoutingModule],
  declarations: [SpecialtiesComponent, SpecialtiesDetailComponent, SpecialtiesUpdateComponent, SpecialtiesDeleteDialogComponent],
  entryComponents: [SpecialtiesDeleteDialogComponent],
})
export class SpecialtiesModule {}
