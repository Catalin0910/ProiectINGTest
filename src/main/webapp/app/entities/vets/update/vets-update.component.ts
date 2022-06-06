import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IVets, Vets } from '../vets.model';
import { VetsService } from '../service/vets.service';

@Component({
  selector: 'jhi-vets-update',
  templateUrl: './vets-update.component.html',
})
export class VetsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    firstname: [null, [Validators.required, Validators.maxLength(32)]],
    lastname: [null, [Validators.required, Validators.maxLength(32)]],
  });

  constructor(protected vetsService: VetsService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vets }) => {
      this.updateForm(vets);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vets = this.createFromForm();
    if (vets.id !== undefined) {
      this.subscribeToSaveResponse(this.vetsService.update(vets));
    } else {
      this.subscribeToSaveResponse(this.vetsService.create(vets));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVets>>): void {
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

  protected updateForm(vets: IVets): void {
    this.editForm.patchValue({
      id: vets.id,
      firstname: vets.firstname,
      lastname: vets.lastname,
    });
  }

  protected createFromForm(): IVets {
    return {
      ...new Vets(),
      id: this.editForm.get(['id'])!.value,
      firstname: this.editForm.get(['firstname'])!.value,
      lastname: this.editForm.get(['lastname'])!.value,
    };
  }
}
