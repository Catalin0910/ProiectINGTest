import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOwners, Owners } from '../owners.model';

import { OwnersService } from './owners.service';

describe('Owners Service', () => {
  let service: OwnersService;
  let httpMock: HttpTestingController;
  let elemDefault: IOwners;
  let expectedResult: IOwners | IOwners[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OwnersService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      firstname: 'AAAAAAA',
      lastname: 'AAAAAAA',
      address: 'AAAAAAA',
      city: 'AAAAAAA',
      telephone: 'AAAAAAA',
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

    it('should create a Owners', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Owners()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Owners', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          firstname: 'BBBBBB',
          lastname: 'BBBBBB',
          address: 'BBBBBB',
          city: 'BBBBBB',
          telephone: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Owners', () => {
      const patchObject = Object.assign(
        {
          firstname: 'BBBBBB',
          lastname: 'BBBBBB',
        },
        new Owners()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Owners', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          firstname: 'BBBBBB',
          lastname: 'BBBBBB',
          address: 'BBBBBB',
          city: 'BBBBBB',
          telephone: 'BBBBBB',
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

    it('should delete a Owners', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOwnersToCollectionIfMissing', () => {
      it('should add a Owners to an empty array', () => {
        const owners: IOwners = { id: 123 };
        expectedResult = service.addOwnersToCollectionIfMissing([], owners);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(owners);
      });

      it('should not add a Owners to an array that contains it', () => {
        const owners: IOwners = { id: 123 };
        const ownersCollection: IOwners[] = [
          {
            ...owners,
          },
          { id: 456 },
        ];
        expectedResult = service.addOwnersToCollectionIfMissing(ownersCollection, owners);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Owners to an array that doesn't contain it", () => {
        const owners: IOwners = { id: 123 };
        const ownersCollection: IOwners[] = [{ id: 456 }];
        expectedResult = service.addOwnersToCollectionIfMissing(ownersCollection, owners);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(owners);
      });

      it('should add only unique Owners to an array', () => {
        const ownersArray: IOwners[] = [{ id: 123 }, { id: 456 }, { id: 26585 }];
        const ownersCollection: IOwners[] = [{ id: 123 }];
        expectedResult = service.addOwnersToCollectionIfMissing(ownersCollection, ...ownersArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const owners: IOwners = { id: 123 };
        const owners2: IOwners = { id: 456 };
        expectedResult = service.addOwnersToCollectionIfMissing([], owners, owners2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(owners);
        expect(expectedResult).toContain(owners2);
      });

      it('should accept null and undefined values', () => {
        const owners: IOwners = { id: 123 };
        expectedResult = service.addOwnersToCollectionIfMissing([], null, owners, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(owners);
      });

      it('should return initial array if no Owners is added', () => {
        const ownersCollection: IOwners[] = [{ id: 123 }];
        expectedResult = service.addOwnersToCollectionIfMissing(ownersCollection, undefined, null);
        expect(expectedResult).toEqual(ownersCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
