import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VisitsComponent } from './list/visits.component';
import { VisitsDetailComponent } from './detail/visits-detail.component';
import { VisitsUpdateComponent } from './update/visits-update.component';
import { VisitsDeleteDialogComponent } from './delete/visits-delete-dialog.component';
import { VisitsRoutingModule } from './route/visits-routing.module';

@NgModule({
  imports: [SharedModule, VisitsRoutingModule],
  declarations: [VisitsComponent, VisitsDetailComponent, VisitsUpdateComponent, VisitsDeleteDialogComponent],
  entryComponents: [VisitsDeleteDialogComponent],
})
export class VisitsModule {}
