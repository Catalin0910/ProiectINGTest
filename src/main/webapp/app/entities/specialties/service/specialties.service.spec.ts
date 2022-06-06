import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISpecialties, Specialties } from '../specialties.model';

import { SpecialtiesService } from './specialties.service';

describe('Specialties Service', () => {
  let service: SpecialtiesService;
  let httpMock: HttpTestingController;
  let elemDefault: ISpecialties;
  let expectedResult: ISpecialties | ISpecialties[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SpecialtiesService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Specialties', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Specialties()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Specialties', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Specialties', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Specialties()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Specialties', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Specialties', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSpecialtiesToCollectionIfMissing', () => {
      it('should add a Specialties to an empty array', () => {
        const specialties: ISpecialties = { id: 123 };
        expectedResult = service.addSpecialtiesToCollectionIfMissing([], specialties);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(specialties);
      });

      it('should not add a Specialties to an array that contains it', () => {
        const specialties: ISpecialties = { id: 123 };
        const specialtiesCollection: ISpecialties[] = [
          {
            ...specialties,
          },
          { id: 456 },
        ];
        expectedResult = service.addSpecialtiesToCollectionIfMissing(specialtiesCollection, specialties);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Specialties to an array that doesn't contain it", () => {
        const specialties: ISpecialties = { id: 123 };
        const specialtiesCollection: ISpecialties[] = [{ id: 456 }];
        expectedResult = service.addSpecialtiesToCollectionIfMissing(specialtiesCollection, specialties);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(specialties);
      });

      it('should add only unique Specialties to an array', () => {
        const specialtiesArray: ISpecialties[] = [{ id: 123 }, { id: 456 }, { id: 49217 }];
        const specialtiesCollection: ISpecialties[] = [{ id: 123 }];
        expectedResult = service.addSpecialtiesToCollectionIfMissing(specialtiesCollection, ...specialtiesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const specialties: ISpecialties = { id: 123 };
        const specialties2: ISpecialties = { id: 456 };
        expectedResult = service.addSpecialtiesToCollectionIfMissing([], specialties, specialties2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(specialties);
        expect(expectedResult).toContain(specialties2);
      });

      it('should accept null and undefined values', () => {
        const specialties: ISpecialties = { id: 123 };
        expectedResult = service.addSpecialtiesToCollectionIfMissing([], null, specialties, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(specialties);
      });

      it('should return initial array if no Specialties is added', () => {
        const specialtiesCollection: ISpecialties[] = [{ id: 123 }];
        expectedResult = service.addSpecialtiesToCollectionIfMissing(specialtiesCollection, undefined, null);
        expect(expectedResult).toEqual(specialtiesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
