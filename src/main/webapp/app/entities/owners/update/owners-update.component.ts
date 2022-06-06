import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IOwners, Owners } from '../owners.model';
import { OwnersService } from '../service/owners.service';

@Component({
  selector: 'jhi-owners-update',
  templateUrl: './owners-update.component.html',
})
export class OwnersUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    firstname: [null, [Validators.required, Validators.maxLength(32)]],
    lastname: [null, [Validators.required, Validators.maxLength(32)]],
    address: [null, [Validators.required, Validators.maxLength(255)]],
    city: [null, [Validators.maxLength(32)]],
    telephone: [null, [Validators.required, Validators.maxLength(20)]],
  });

  constructor(protected ownersService: OwnersService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ owners }) => {
      this.updateForm(owners);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const owners = this.createFromForm();
    if (owners.id !== undefined) {
      this.subscribeToSaveResponse(this.ownersService.update(owners));
    } else {
      this.subscribeToSaveResponse(this.ownersService.create(owners));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOwners>>): void {
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

  protected updateForm(owners: IOwners): void {
    this.editForm.patchValue({
      id: owners.id,
      firstname: owners.firstname,
      lastname: owners.lastname,
      address: owners.address,
      city: owners.city,
      telephone: owners.telephone,
    });
  }

  protected createFromForm(): IOwners {
    return {
      ...new Owners(),
      id: this.editForm.get(['id'])!.value,
      firstname: this.editForm.get(['firstname'])!.value,
      lastname: this.editForm.get(['lastname'])!.value,
      address: this.editForm.get(['address'])!.value,
      city: this.editForm.get(['city'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
    };
  }
}
