import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPets } from '../pets.model';
import { PetsService } from '../service/pets.service';

@Component({
  templateUrl: './pets-delete-dialog.component.html',
})
export class PetsDeleteDialogComponent {
  pets?: IPets;

  constructor(protected petsService: PetsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.petsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
