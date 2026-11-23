
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

import { Dashboard } from './dashboard';
import { EmployeeService } from '../../services/employee';
import { AuthService } from '../../services/auth';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  const mockEmployees = [
    {
      id: 1,
      fullName: 'John Smith',
      email: 'john@gmail.com',
      phone: '9876543210',
      department: 'IT',
      designation: 'Developer',
      joiningDate: '2026-01-01',
      activeStatus: true
    },
    {
      id: 2,
      fullName: 'Jane Doe',
      email: 'jane@gmail.com',
      phone: '9876543211',
      department: 'HR',
      designation: 'Manager',
      joiningDate: '2026-02-01',
      activeStatus: false
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        {
          provide: EmployeeService,
          useValue: {
            getAllEmployees: () => of(mockEmployees)
          }
        },
        {
          provide: AuthService,
          useValue: {
            logout: () => {},
            getRole: () => 'ADMIN'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
