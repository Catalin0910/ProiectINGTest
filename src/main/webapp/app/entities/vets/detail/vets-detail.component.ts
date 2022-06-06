import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVets } from '../vets.model';

@Component({
  selector: 'jhi-vets-detail',
  templateUrl: './vets-detail.component.html',
})
export class VetsDetailComponent implements OnInit {
  vets: IVets | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vets }) => {
      this.vets = vets;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
