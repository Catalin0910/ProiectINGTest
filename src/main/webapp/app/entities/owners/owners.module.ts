import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OwnersComponent } from './list/owners.component';
import { OwnersDetailComponent } from './detail/owners-detail.component';
import { OwnersUpdateComponent } from './update/owners-update.component';
import { OwnersDeleteDialogComponent } from './delete/owners-delete-dialog.component';
import { OwnersRoutingModule } from './route/owners-routing.module';

@NgModule({
  imports: [SharedModule, OwnersRoutingModule],
  declarations: [OwnersComponent, OwnersDetailComponent, OwnersUpdateComponent, OwnersDeleteDialogComponent],
  entryComponents: [OwnersDeleteDialogComponent],
})
export class OwnersModule {}
