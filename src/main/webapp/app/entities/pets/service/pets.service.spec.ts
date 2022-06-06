import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPets, Pets } from '../pets.model';

import { PetsService } from './pets.service';

describe('Pets Service', () => {
  let service: PetsService;
  let httpMock: HttpTestingController;
  let elemDefault: IPets;
  let expectedResult: IPets | IPets[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PetsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      birthdate: 'AAAAAAA',
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

    it('should create a Pets', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Pets()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Pets', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          birthdate: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Pets', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          birthdate: 'BBBBBB',
        },
        new Pets()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Pets', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          birthdate: 'BBBBBB',
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

    it('should delete a Pets', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPetsToCollectionIfMissing', () => {
      it('should add a Pets to an empty array', () => {
        const pets: IPets = { id: 123 };
        expectedResult = service.addPetsToCollectionIfMissing([], pets);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pets);
      });

      it('should not add a Pets to an array that contains it', () => {
        const pets: IPets = { id: 123 };
        const petsCollection: IPets[] = [
          {
            ...pets,
          },
          { id: 456 },
        ];
        expectedResult = service.addPetsToCollectionIfMissing(petsCollection, pets);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Pets to an array that doesn't contain it", () => {
        const pets: IPets = { id: 123 };
        const petsCollection: IPets[] = [{ id: 456 }];
        expectedResult = service.addPetsToCollectionIfMissing(petsCollection, pets);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pets);
      });

      it('should add only unique Pets to an array', () => {
        const petsArray: IPets[] = [{ id: 123 }, { id: 456 }, { id: 34451 }];
        const petsCollection: IPets[] = [{ id: 123 }];
        expectedResult = service.addPetsToCollectionIfMissing(petsCollection, ...petsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pets: IPets = { id: 123 };
        const pets2: IPets = { id: 456 };
        expectedResult = service.addPetsToCollectionIfMissing([], pets, pets2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pets);
        expect(expectedResult).toContain(pets2);
      });

      it('should accept null and undefined values', () => {
        const pets: IPets = { id: 123 };
        expectedResult = service.addPetsToCollectionIfMissing([], null, pets, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pets);
      });

      it('should return initial array if no Pets is added', () => {
        const petsCollection: IPets[] = [{ id: 123 }];
        expectedResult = service.addPetsToCollectionIfMissing(petsCollection, undefined, null);
        expect(expectedResult).toEqual(petsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
