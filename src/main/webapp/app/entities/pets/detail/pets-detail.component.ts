import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPets } from '../pets.model';

@Component({
  selector: 'jhi-pets-detail',
  templateUrl: './pets-detail.component.html',
})
export class PetsDetailComponent implements OnInit {
  pets: IPets | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pets }) => {
      this.pets = pets;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
