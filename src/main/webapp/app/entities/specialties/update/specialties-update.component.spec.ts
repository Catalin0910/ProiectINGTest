import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SpecialtiesService } from '../service/specialties.service';
import { ISpecialties, Specialties } from '../specialties.model';
import { IVets } from 'app/entities/vets/vets.model';
import { VetsService } from 'app/entities/vets/service/vets.service';

import { SpecialtiesUpdateComponent } from './specialties-update.component';

describe('Specialties Management Update Component', () => {
  let comp: SpecialtiesUpdateComponent;
  let fixture: ComponentFixture<SpecialtiesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let specialtiesService: SpecialtiesService;
  let vetsService: VetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SpecialtiesUpdateComponent],
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
      .overrideTemplate(SpecialtiesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SpecialtiesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    specialtiesService = TestBed.inject(SpecialtiesService);
    vetsService = TestBed.inject(VetsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Vets query and add missing value', () => {
      const specialties: ISpecialties = { id: 456 };
      const vets: IVets[] = [{ id: 67269 }];
      specialties.vets = vets;

      const vetsCollection: IVets[] = [{ id: 62972 }];
      jest.spyOn(vetsService, 'query').mockReturnValue(of(new HttpResponse({ body: vetsCollection })));
      const additionalVets = [...vets];
      const expectedCollection: IVets[] = [...additionalVets, ...vetsCollection];
      jest.spyOn(vetsService, 'addVetsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ specialties });
      comp.ngOnInit();

      expect(vetsService.query).toHaveBeenCalled();
      expect(vetsService.addVetsToCollectionIfMissing).toHaveBeenCalledWith(vetsCollection, ...additionalVets);
      expect(comp.vetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const specialties: ISpecialties = { id: 456 };
      const vets: IVets = { id: 90600 };
      specialties.vets = [vets];

      activatedRoute.data = of({ specialties });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(specialties));
      expect(comp.vetsSharedCollection).toContain(vets);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Specialties>>();
      const specialties = { id: 123 };
      jest.spyOn(specialtiesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ specialties });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: specialties }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(specialtiesService.update).toHaveBeenCalledWith(specialties);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Specialties>>();
      const specialties = new Specialties();
      jest.spyOn(specialtiesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ specialties });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: specialties }));
      saveSubject.complete();

      // THEN
      expect(specialtiesService.create).toHaveBeenCalledWith(specialties);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Specialties>>();
      const specialties = { id: 123 };
      jest.spyOn(specialtiesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ specialties });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(specialtiesService.update).toHaveBeenCalledWith(specialties);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackVetsById', () => {
      it('Should return tracked Vets primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackVetsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedVets', () => {
      it('Should return option if no Vets is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedVets(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Vets for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedVets(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Vets is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedVets(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
