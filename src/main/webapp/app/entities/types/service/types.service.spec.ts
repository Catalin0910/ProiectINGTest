import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypes, Types } from '../types.model';

import { TypesService } from './types.service';

describe('Types Service', () => {
  let service: TypesService;
  let httpMock: HttpTestingController;
  let elemDefault: ITypes;
  let expectedResult: ITypes | ITypes[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypesService);
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

    it('should create a Types', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Types()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Types', () => {
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

    it('should partial update a Types', () => {
      const patchObject = Object.assign({}, new Types());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Types', () => {
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

    it('should delete a Types', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTypesToCollectionIfMissing', () => {
      it('should add a Types to an empty array', () => {
        const types: ITypes = { id: 123 };
        expectedResult = service.addTypesToCollectionIfMissing([], types);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(types);
      });

      it('should not add a Types to an array that contains it', () => {
        const types: ITypes = { id: 123 };
        const typesCollection: ITypes[] = [
          {
            ...types,
          },
          { id: 456 },
        ];
        expectedResult = service.addTypesToCollectionIfMissing(typesCollection, types);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Types to an array that doesn't contain it", () => {
        const types: ITypes = { id: 123 };
        const typesCollection: ITypes[] = [{ id: 456 }];
        expectedResult = service.addTypesToCollectionIfMissing(typesCollection, types);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(types);
      });

      it('should add only unique Types to an array', () => {
        const typesArray: ITypes[] = [{ id: 123 }, { id: 456 }, { id: 69050 }];
        const typesCollection: ITypes[] = [{ id: 123 }];
        expectedResult = service.addTypesToCollectionIfMissing(typesCollection, ...typesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const types: ITypes = { id: 123 };
        const types2: ITypes = { id: 456 };
        expectedResult = service.addTypesToCollectionIfMissing([], types, types2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(types);
        expect(expectedResult).toContain(types2);
      });

      it('should accept null and undefined values', () => {
        const types: ITypes = { id: 123 };
        expectedResult = service.addTypesToCollectionIfMissing([], null, types, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(types);
      });

      it('should return initial array if no Types is added', () => {
        const typesCollection: ITypes[] = [{ id: 123 }];
        expectedResult = service.addTypesToCollectionIfMissing(typesCollection, undefined, null);
        expect(expectedResult).toEqual(typesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
