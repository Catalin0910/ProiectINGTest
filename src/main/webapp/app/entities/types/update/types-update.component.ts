import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITypes, Types } from '../types.model';
import { TypesService } from '../service/types.service';

@Component({
  selector: 'jhi-types-update',
  templateUrl: './types-update.component.html',
})
export class TypesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(80)]],
  });

  constructor(protected typesService: TypesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ types }) => {
      this.updateForm(types);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const types = this.createFromForm();
    if (types.id !== undefined) {
      this.subscribeToSaveResponse(this.typesService.update(types));
    } else {
      this.subscribeToSaveResponse(this.typesService.create(types));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypes>>): void {
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

  protected updateForm(types: ITypes): void {
    this.editForm.patchValue({
      id: types.id,
      name: types.name,
    });
  }

  protected createFromForm(): ITypes {
    return {
      ...new Types(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
