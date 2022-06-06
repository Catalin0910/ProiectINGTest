import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOwners } from '../owners.model';

@Component({
  selector: 'jhi-owners-detail',
  templateUrl: './owners-detail.component.html',
})
export class OwnersDetailComponent implements OnInit {
  owners: IOwners | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ owners }) => {
      this.owners = owners;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
