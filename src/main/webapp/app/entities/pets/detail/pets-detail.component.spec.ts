import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PetsDetailComponent } from './pets-detail.component';

describe('Pets Management Detail Component', () => {
  let comp: PetsDetailComponent;
  let fixture: ComponentFixture<PetsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ pets: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PetsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PetsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pets on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.pets).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
