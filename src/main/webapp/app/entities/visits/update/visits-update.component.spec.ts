import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VisitsService } from '../service/visits.service';
import { IVisits, Visits } from '../visits.model';
import { IPets } from 'app/entities/pets/pets.model';
import { PetsService } from 'app/entities/pets/service/pets.service';

import { VisitsUpdateComponent } from './visits-update.component';

describe('Visits Management Update Component', () => {
  let comp: VisitsUpdateComponent;
  let fixture: ComponentFixture<VisitsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let visitsService: VisitsService;
  let petsService: PetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VisitsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(VisitsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VisitsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    visitsService = TestBed.inject(VisitsService);
    petsService = TestBed.inject(PetsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Pets query and add missing value', () => {
      const visits: IVisits = { id: 456 };
      const pet: IPets = { id: 45511 };
      visits.pet = pet;

      const petsCollection: IPets[] = [{ id: 24170 }];
      jest.spyOn(petsService, 'query').mockReturnValue(of(new HttpResponse({ body: petsCollection })));
      const additionalPets = [pet];
      const expectedCollection: IPets[] = [...additionalPets, ...petsCollection];
      jest.spyOn(petsService, 'addPetsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ visits });
      comp.ngOnInit();

      expect(petsService.query).toHaveBeenCalled();
      expect(petsService.addPetsToCollectionIfMissing).toHaveBeenCalledWith(petsCollection, ...additionalPets);
      expect(comp.petsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const visits: IVisits = { id: 456 };
      const pet: IPets = { id: 95893 };
      visits.pet = pet;

      activatedRoute.data = of({ visits });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(visits));
      expect(comp.petsSharedCollection).toContain(pet);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Visits>>();
      const visits = { id: 123 };
      jest.spyOn(visitsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visits });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: visits }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(visitsService.update).toHaveBeenCalledWith(visits);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Visits>>();
      const visits = new Visits();
      jest.spyOn(visitsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visits });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: visits }));
      saveSubject.complete();

      // THEN
      expect(visitsService.create).toHaveBeenCalledWith(visits);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Visits>>();
      const visits = { id: 123 };
      jest.spyOn(visitsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visits });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(visitsService.update).toHaveBeenCalledWith(visits);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPetsById', () => {
      it('Should return tracked Pets primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPetsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
