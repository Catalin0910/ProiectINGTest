import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SpecialtiesDetailComponent } from './specialties-detail.component';

describe('Specialties Management Detail Component', () => {
  let comp: SpecialtiesDetailComponent;
  let fixture: ComponentFixture<SpecialtiesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialtiesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ specialties: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SpecialtiesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SpecialtiesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load specialties on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.specialties).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
