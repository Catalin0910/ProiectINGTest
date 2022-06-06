import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVisits } from '../visits.model';

@Component({
  selector: 'jhi-visits-detail',
  templateUrl: './visits-detail.component.html',
})
export class VisitsDetailComponent implements OnInit {
  visits: IVisits | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ visits }) => {
      this.visits = visits;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
