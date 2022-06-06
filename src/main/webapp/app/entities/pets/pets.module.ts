import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PetsComponent } from './list/pets.component';
import { PetsDetailComponent } from './detail/pets-detail.component';
import { PetsUpdateComponent } from './update/pets-update.component';
import { PetsDeleteDialogComponent } from './delete/pets-delete-dialog.component';
import { PetsRoutingModule } from './route/pets-routing.module';

@NgModule({
  imports: [SharedModule, PetsRoutingModule],
  declarations: [PetsComponent, PetsDetailComponent, PetsUpdateComponent, PetsDeleteDialogComponent],
  entryComponents: [PetsDeleteDialogComponent],
})
export class PetsModule {}
