import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOwners } from '../owners.model';
import { OwnersService } from '../service/owners.service';

@Component({
  templateUrl: './owners-delete-dialog.component.html',
})
export class OwnersDeleteDialogComponent {
  owners?: IOwners;

  constructor(protected ownersService: OwnersService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ownersService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
