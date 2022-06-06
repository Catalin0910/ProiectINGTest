import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VetsComponent } from './list/vets.component';
import { VetsDetailComponent } from './detail/vets-detail.component';
import { VetsUpdateComponent } from './update/vets-update.component';
import { VetsDeleteDialogComponent } from './delete/vets-delete-dialog.component';
import { VetsRoutingModule } from './route/vets-routing.module';

@NgModule({
  imports: [SharedModule, VetsRoutingModule],
  declarations: [VetsComponent, VetsDetailComponent, VetsUpdateComponent, VetsDeleteDialogComponent],
  entryComponents: [VetsDeleteDialogComponent],
})
export class VetsModule {}
