import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVisits } from '../visits.model';
import { VisitsService } from '../service/visits.service';

@Component({
  templateUrl: './visits-delete-dialog.component.html',
})
export class VisitsDeleteDialogComponent {
  visits?: IVisits;

  constructor(protected visitsService: VisitsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.visitsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
