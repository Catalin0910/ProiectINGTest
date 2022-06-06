import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypes } from '../types.model';
import { TypesService } from '../service/types.service';

@Component({
  templateUrl: './types-delete-dialog.component.html',
})
export class TypesDeleteDialogComponent {
  types?: ITypes;

  constructor(protected typesService: TypesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
