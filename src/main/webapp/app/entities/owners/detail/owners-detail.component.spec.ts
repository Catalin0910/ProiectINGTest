import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OwnersDetailComponent } from './owners-detail.component';

describe('Owners Management Detail Component', () => {
  let comp: OwnersDetailComponent;
  let fixture: ComponentFixture<OwnersDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnersDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ owners: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OwnersDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OwnersDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load owners on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.owners).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
