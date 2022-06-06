import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVets } from '../vets.model';
import { VetsService } from '../service/vets.service';

@Component({
  templateUrl: './vets-delete-dialog.component.html',
})
export class VetsDeleteDialogComponent {
  vets?: IVets;

  constructor(protected vetsService: VetsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vetsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
