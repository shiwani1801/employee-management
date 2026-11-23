import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-employee.html',
  styleUrl: './edit-employee.css'
})
export class EditEmployee implements OnInit {

  employee: Employee = {
    fullName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joiningDate: '',
    activeStatus: true
  };

  employeeId!: number;
  successMessage = '';
  errorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEmployee();
  }

  loadEmployee(): void {
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (data) => {
        this.employee = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        this.errorMessage = 'Unable to load employee details.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    this.employeeService.updateEmployee(this.employeeId, this.employee).subscribe({
      next: () => {
        this.successMessage = 'Employee updated successfully!';
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error updating employee:', error);
        this.errorMessage = 'Unable to update employee.';
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
  this.router.navigate(['/employees']);
}
}