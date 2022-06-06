import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISpecialties } from '../specialties.model';

@Component({
  selector: 'jhi-specialties-detail',
  templateUrl: './specialties-detail.component.html',
})
export class SpecialtiesDetailComponent implements OnInit {
  specialties: ISpecialties | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ specialties }) => {
      this.specialties = specialties;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
