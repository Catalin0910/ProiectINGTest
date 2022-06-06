import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IVisits, Visits } from '../visits.model';
import { VisitsService } from '../service/visits.service';
import { IPets } from 'app/entities/pets/pets.model';
import { PetsService } from 'app/entities/pets/service/pets.service';

@Component({
  selector: 'jhi-visits-update',
  templateUrl: './visits-update.component.html',
})
export class VisitsUpdateComponent implements OnInit {
  isSaving = false;

  petsSharedCollection: IPets[] = [];

  editForm = this.fb.group({
    id: [],
    visitdate: [null, [Validators.required]],
    description: [null, [Validators.required, Validators.maxLength(255)]],
    pet: [],
  });

  constructor(
    protected visitsService: VisitsService,
    protected petsService: PetsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ visits }) => {
      if (visits.id === undefined) {
        const today = dayjs().startOf('day');
        visits.visitdate = today;
      }

      this.updateForm(visits);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const visits = this.createFromForm();
    if (visits.id !== undefined) {
      this.subscribeToSaveResponse(this.visitsService.update(visits));
    } else {
      this.subscribeToSaveResponse(this.visitsService.create(visits));
    }
  }

  trackPetsById(_index: number, item: IPets): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVisits>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(visits: IVisits): void {
    this.editForm.patchValue({
      id: visits.id,
      visitdate: visits.visitdate ? visits.visitdate.format(DATE_TIME_FORMAT) : null,
      description: visits.description,
      pet: visits.pet,
    });

    this.petsSharedCollection = this.petsService.addPetsToCollectionIfMissing(this.petsSharedCollection, visits.pet);
  }

  protected loadRelationshipsOptions(): void {
    this.petsService
      .query()
      .pipe(map((res: HttpResponse<IPets[]>) => res.body ?? []))
      .pipe(map((pets: IPets[]) => this.petsService.addPetsToCollectionIfMissing(pets, this.editForm.get('pet')!.value)))
      .subscribe((pets: IPets[]) => (this.petsSharedCollection = pets));
  }

  protected createFromForm(): IVisits {
    return {
      ...new Visits(),
      id: this.editForm.get(['id'])!.value,
      visitdate: this.editForm.get(['visitdate'])!.value ? dayjs(this.editForm.get(['visitdate'])!.value, DATE_TIME_FORMAT) : undefined,
      description: this.editForm.get(['description'])!.value,
      pet: this.editForm.get(['pet'])!.value,
    };
  }
}
