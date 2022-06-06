import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VetsDetailComponent } from './vets-detail.component';

describe('Vets Management Detail Component', () => {
  let comp: VetsDetailComponent;
  let fixture: ComponentFixture<VetsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VetsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ vets: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VetsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VetsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load vets on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.vets).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
