import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVisits, Visits } from '../visits.model';

import { VisitsService } from './visits.service';

describe('Visits Service', () => {
  let service: VisitsService;
  let httpMock: HttpTestingController;
  let elemDefault: IVisits;
  let expectedResult: IVisits | IVisits[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VisitsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      visitdate: currentDate,
      description: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          visitdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Visits', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          visitdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          visitdate: currentDate,
        },
        returnedFromService
      );

      service.create(new Visits()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Visits', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          visitdate: currentDate.format(DATE_TIME_FORMAT),
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          visitdate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Visits', () => {
      const patchObject = Object.assign(
        {
          visitdate: currentDate.format(DATE_TIME_FORMAT),
        },
        new Visits()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          visitdate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Visits', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          visitdate: currentDate.format(DATE_TIME_FORMAT),
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          visitdate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Visits', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addVisitsToCollectionIfMissing', () => {
      it('should add a Visits to an empty array', () => {
        const visits: IVisits = { id: 123 };
        expectedResult = service.addVisitsToCollectionIfMissing([], visits);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(visits);
      });

      it('should not add a Visits to an array that contains it', () => {
        const visits: IVisits = { id: 123 };
        const visitsCollection: IVisits[] = [
          {
            ...visits,
          },
          { id: 456 },
        ];
        expectedResult = service.addVisitsToCollectionIfMissing(visitsCollection, visits);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Visits to an array that doesn't contain it", () => {
        const visits: IVisits = { id: 123 };
        const visitsCollection: IVisits[] = [{ id: 456 }];
        expectedResult = service.addVisitsToCollectionIfMissing(visitsCollection, visits);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(visits);
      });

      it('should add only unique Visits to an array', () => {
        const visitsArray: IVisits[] = [{ id: 123 }, { id: 456 }, { id: 55341 }];
        const visitsCollection: IVisits[] = [{ id: 123 }];
        expectedResult = service.addVisitsToCollectionIfMissing(visitsCollection, ...visitsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const visits: IVisits = { id: 123 };
        const visits2: IVisits = { id: 456 };
        expectedResult = service.addVisitsToCollectionIfMissing([], visits, visits2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(visits);
        expect(expectedResult).toContain(visits2);
      });

      it('should accept null and undefined values', () => {
        const visits: IVisits = { id: 123 };
        expectedResult = service.addVisitsToCollectionIfMissing([], null, visits, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(visits);
      });

      it('should return initial array if no Visits is added', () => {
        const visitsCollection: IVisits[] = [{ id: 123 }];
        expectedResult = service.addVisitsToCollectionIfMissing(visitsCollection, undefined, null);
        expect(expectedResult).toEqual(visitsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
