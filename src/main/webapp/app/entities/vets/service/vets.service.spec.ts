import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVets, Vets } from '../vets.model';

import { VetsService } from './vets.service';

describe('Vets Service', () => {
  let service: VetsService;
  let httpMock: HttpTestingController;
  let elemDefault: IVets;
  let expectedResult: IVets | IVets[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VetsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      firstname: 'AAAAAAA',
      lastname: 'AAAAAAA',
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

    it('should create a Vets', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Vets()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Vets', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          firstname: 'BBBBBB',
          lastname: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Vets', () => {
      const patchObject = Object.assign(
        {
          firstname: 'BBBBBB',
          lastname: 'BBBBBB',
        },
        new Vets()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Vets', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          firstname: 'BBBBBB',
          lastname: 'BBBBBB',
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

    it('should delete a Vets', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addVetsToCollectionIfMissing', () => {
      it('should add a Vets to an empty array', () => {
        const vets: IVets = { id: 123 };
        expectedResult = service.addVetsToCollectionIfMissing([], vets);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vets);
      });

      it('should not add a Vets to an array that contains it', () => {
        const vets: IVets = { id: 123 };
        const vetsCollection: IVets[] = [
          {
            ...vets,
          },
          { id: 456 },
        ];
        expectedResult = service.addVetsToCollectionIfMissing(vetsCollection, vets);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Vets to an array that doesn't contain it", () => {
        const vets: IVets = { id: 123 };
        const vetsCollection: IVets[] = [{ id: 456 }];
        expectedResult = service.addVetsToCollectionIfMissing(vetsCollection, vets);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vets);
      });

      it('should add only unique Vets to an array', () => {
        const vetsArray: IVets[] = [{ id: 123 }, { id: 456 }, { id: 27969 }];
        const vetsCollection: IVets[] = [{ id: 123 }];
        expectedResult = service.addVetsToCollectionIfMissing(vetsCollection, ...vetsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vets: IVets = { id: 123 };
        const vets2: IVets = { id: 456 };
        expectedResult = service.addVetsToCollectionIfMissing([], vets, vets2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vets);
        expect(expectedResult).toContain(vets2);
      });

      it('should accept null and undefined values', () => {
        const vets: IVets = { id: 123 };
        expectedResult = service.addVetsToCollectionIfMissing([], null, vets, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vets);
      });

      it('should return initial array if no Vets is added', () => {
        const vetsCollection: IVets[] = [{ id: 123 }];
        expectedResult = service.addVetsToCollectionIfMissing(vetsCollection, undefined, null);
        expect(expectedResult).toEqual(vetsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
