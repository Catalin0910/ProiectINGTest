import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPets, Pets } from '../pets.model';
import { PetsService } from '../service/pets.service';
import { ITypes } from 'app/entities/types/types.model';
import { TypesService } from 'app/entities/types/service/types.service';
import { IOwners } from 'app/entities/owners/owners.model';
import { OwnersService } from 'app/entities/owners/service/owners.service';

@Component({
  selector: 'jhi-pets-update',
  templateUrl: './pets-update.component.html',
})
export class PetsUpdateComponent implements OnInit {
  isSaving = false;

  typesSharedCollection: ITypes[] = [];
  ownersSharedCollection: IOwners[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(32)]],
    birthdate: [null, [Validators.required]],
    type: [],
    owner: [],
  });

  constructor(
    protected petsService: PetsService,
    protected typesService: TypesService,
    protected ownersService: OwnersService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pets }) => {
      this.updateForm(pets);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pets = this.createFromForm();
    if (pets.id !== undefined) {
      this.subscribeToSaveResponse(this.petsService.update(pets));
    } else {
      this.subscribeToSaveResponse(this.petsService.create(pets));
    }
  }

  trackTypesById(_index: number, item: ITypes): number {
    return item.id!;
  }

  trackOwnersById(_index: number, item: IOwners): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPets>>): void {
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

  protected updateForm(pets: IPets): void {
    this.editForm.patchValue({
      id: pets.id,
      name: pets.name,
      birthdate: pets.birthdate,
      type: pets.type,
      owner: pets.owner,
    });

    this.typesSharedCollection = this.typesService.addTypesToCollectionIfMissing(this.typesSharedCollection, pets.type);
    this.ownersSharedCollection = this.ownersService.addOwnersToCollectionIfMissing(this.ownersSharedCollection, pets.owner);
  }

  protected loadRelationshipsOptions(): void {
    this.typesService
      .query()
      .pipe(map((res: HttpResponse<ITypes[]>) => res.body ?? []))
      .pipe(map((types: ITypes[]) => this.typesService.addTypesToCollectionIfMissing(types, this.editForm.get('type')!.value)))
      .subscribe((types: ITypes[]) => (this.typesSharedCollection = types));

    this.ownersService
      .query()
      .pipe(map((res: HttpResponse<IOwners[]>) => res.body ?? []))
      .pipe(map((owners: IOwners[]) => this.ownersService.addOwnersToCollectionIfMissing(owners, this.editForm.get('owner')!.value)))
      .subscribe((owners: IOwners[]) => (this.ownersSharedCollection = owners));
  }

  protected createFromForm(): IPets {
    return {
      ...new Pets(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      birthdate: this.editForm.get(['birthdate'])!.value,
      type: this.editForm.get(['type'])!.value,
      owner: this.editForm.get(['owner'])!.value,
    };
  }
}
