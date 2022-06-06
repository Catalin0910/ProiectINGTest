import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISpecialties, Specialties } from '../specialties.model';
import { SpecialtiesService } from '../service/specialties.service';
import { IVets } from 'app/entities/vets/vets.model';
import { VetsService } from 'app/entities/vets/service/vets.service';

@Component({
  selector: 'jhi-specialties-update',
  templateUrl: './specialties-update.component.html',
})
export class SpecialtiesUpdateComponent implements OnInit {
  isSaving = false;

  vetsSharedCollection: IVets[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(32)]],
    vets: [],
  });

  constructor(
    protected specialtiesService: SpecialtiesService,
    protected vetsService: VetsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ specialties }) => {
      this.updateForm(specialties);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const specialties = this.createFromForm();
    if (specialties.id !== undefined) {
      this.subscribeToSaveResponse(this.specialtiesService.update(specialties));
    } else {
      this.subscribeToSaveResponse(this.specialtiesService.create(specialties));
    }
  }

  trackVetsById(_index: number, item: IVets): number {
    return item.id!;
  }

  getSelectedVets(option: IVets, selectedVals?: IVets[]): IVets {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISpecialties>>): void {
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

  protected updateForm(specialties: ISpecialties): void {
    this.editForm.patchValue({
      id: specialties.id,
      name: specialties.name,
      vets: specialties.vets,
    });

    this.vetsSharedCollection = this.vetsService.addVetsToCollectionIfMissing(this.vetsSharedCollection, ...(specialties.vets ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.vetsService
      .query()
      .pipe(map((res: HttpResponse<IVets[]>) => res.body ?? []))
      .pipe(map((vets: IVets[]) => this.vetsService.addVetsToCollectionIfMissing(vets, ...(this.editForm.get('vets')!.value ?? []))))
      .subscribe((vets: IVets[]) => (this.vetsSharedCollection = vets));
  }

  protected createFromForm(): ISpecialties {
    return {
      ...new Specialties(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      vets: this.editForm.get(['vets'])!.value,
    };
  }
}
