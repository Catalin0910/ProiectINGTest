import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISpecialties } from '../specialties.model';
import { SpecialtiesService } from '../service/specialties.service';
import { SpecialtiesDeleteDialogComponent } from '../delete/specialties-delete-dialog.component';

@Component({
  selector: 'jhi-specialties',
  templateUrl: './specialties.component.html',
})
export class SpecialtiesComponent implements OnInit {
  specialties?: ISpecialties[];
  isLoading = false;

  constructor(protected specialtiesService: SpecialtiesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.specialtiesService.query().subscribe({
      next: (res: HttpResponse<ISpecialties[]>) => {
        this.isLoading = false;
        this.specialties = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ISpecialties): number {
    return item.id!;
  }

  delete(specialties: ISpecialties): void {
    const modalRef = this.modalService.open(SpecialtiesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.specialties = specialties;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
