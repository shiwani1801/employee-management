import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css'
})
export class AddEmployee {

  employee: Employee = {
    fullName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joiningDate: '',
    activeStatus: true
  };

  successMessage = '';
  errorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    this.employeeService.addEmployee(this.employee).subscribe({

      next: (response) => {
        this.successMessage = 'Employee added successfully!';

        this.employee = {
          fullName: '',
          email: '',
          phone: '',
          department: '',
          designation: '',
          joiningDate: '',
          activeStatus: true
        };

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error adding employee:', error);
        this.errorMessage = 'Unable to add employee.';
        this.cdr.detectChanges();
      }

    });
  }

  goBack(): void {
  this.router.navigate(['/employees']);
  }
}