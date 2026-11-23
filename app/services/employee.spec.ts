
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { EmployeeService } from './employee';
import { Employee } from '../models/employee';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all employees', () => {
    const mockEmployees: Employee[] = [
      {
        id: 1,
        fullName: 'John Smith',
        email: 'john@gmail.com',
        phone: '9876543210',
        department: 'IT',
        designation: 'Developer',
        joiningDate: '2026-01-01',
        activeStatus: true
      }
    ];

    service.getAllEmployees().subscribe(data => {
      expect(data).toEqual(mockEmployees);
    });

    const req = httpMock.expectOne(
      'http://localhost:8080/api/employees'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);
  });
});
