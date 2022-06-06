import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VisitsDetailComponent } from './visits-detail.component';

describe('Visits Management Detail Component', () => {
  let comp: VisitsDetailComponent;
  let fixture: ComponentFixture<VisitsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ visits: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VisitsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VisitsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load visits on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.visits).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
