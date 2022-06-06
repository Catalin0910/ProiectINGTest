import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PetsService } from '../service/pets.service';
import { IPets, Pets } from '../pets.model';
import { ITypes } from 'app/entities/types/types.model';
import { TypesService } from 'app/entities/types/service/types.service';
import { IOwners } from 'app/entities/owners/owners.model';
import { OwnersService } from 'app/entities/owners/service/owners.service';

import { PetsUpdateComponent } from './pets-update.component';

describe('Pets Management Update Component', () => {
  let comp: PetsUpdateComponent;
  let fixture: ComponentFixture<PetsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let petsService: PetsService;
  let typesService: TypesService;
  let ownersService: OwnersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PetsUpdateComponent],
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
      .overrideTemplate(PetsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PetsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    petsService = TestBed.inject(PetsService);
    typesService = TestBed.inject(TypesService);
    ownersService = TestBed.inject(OwnersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Types query and add missing value', () => {
      const pets: IPets = { id: 456 };
      const type: ITypes = { id: 68268 };
      pets.type = type;

      const typesCollection: ITypes[] = [{ id: 24837 }];
      jest.spyOn(typesService, 'query').mockReturnValue(of(new HttpResponse({ body: typesCollection })));
      const additionalTypes = [type];
      const expectedCollection: ITypes[] = [...additionalTypes, ...typesCollection];
      jest.spyOn(typesService, 'addTypesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pets });
      comp.ngOnInit();

      expect(typesService.query).toHaveBeenCalled();
      expect(typesService.addTypesToCollectionIfMissing).toHaveBeenCalledWith(typesCollection, ...additionalTypes);
      expect(comp.typesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Owners query and add missing value', () => {
      const pets: IPets = { id: 456 };
      const owner: IOwners = { id: 95703 };
      pets.owner = owner;

      const ownersCollection: IOwners[] = [{ id: 14387 }];
      jest.spyOn(ownersService, 'query').mockReturnValue(of(new HttpResponse({ body: ownersCollection })));
      const additionalOwners = [owner];
      const expectedCollection: IOwners[] = [...additionalOwners, ...ownersCollection];
      jest.spyOn(ownersService, 'addOwnersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pets });
      comp.ngOnInit();

      expect(ownersService.query).toHaveBeenCalled();
      expect(ownersService.addOwnersToCollectionIfMissing).toHaveBeenCalledWith(ownersCollection, ...additionalOwners);
      expect(comp.ownersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pets: IPets = { id: 456 };
      const type: ITypes = { id: 24684 };
      pets.type = type;
      const owner: IOwners = { id: 64714 };
      pets.owner = owner;

      activatedRoute.data = of({ pets });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(pets));
      expect(comp.typesSharedCollection).toContain(type);
      expect(comp.ownersSharedCollection).toContain(owner);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pets>>();
      const pets = { id: 123 };
      jest.spyOn(petsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pets });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pets }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(petsService.update).toHaveBeenCalledWith(pets);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pets>>();
      const pets = new Pets();
      jest.spyOn(petsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pets });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pets }));
      saveSubject.complete();

      // THEN
      expect(petsService.create).toHaveBeenCalledWith(pets);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pets>>();
      const pets = { id: 123 };
      jest.spyOn(petsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pets });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(petsService.update).toHaveBeenCalledWith(pets);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTypesById', () => {
      it('Should return tracked Types primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTypesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackOwnersById', () => {
      it('Should return tracked Owners primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOwnersById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
