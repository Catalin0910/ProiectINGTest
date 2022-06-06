import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypesService } from '../service/types.service';
import { ITypes, Types } from '../types.model';

import { TypesUpdateComponent } from './types-update.component';

describe('Types Management Update Component', () => {
  let comp: TypesUpdateComponent;
  let fixture: ComponentFixture<TypesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typesService: TypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypesUpdateComponent],
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
      .overrideTemplate(TypesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typesService = TestBed.inject(TypesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const types: ITypes = { id: 456 };

      activatedRoute.data = of({ types });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(types));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Types>>();
      const types = { id: 123 };
      jest.spyOn(typesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ types });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: types }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(typesService.update).toHaveBeenCalledWith(types);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Types>>();
      const types = new Types();
      jest.spyOn(typesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ types });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: types }));
      saveSubject.complete();

      // THEN
      expect(typesService.create).toHaveBeenCalledWith(types);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Types>>();
      const types = { id: 123 };
      jest.spyOn(typesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ types });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typesService.update).toHaveBeenCalledWith(types);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
