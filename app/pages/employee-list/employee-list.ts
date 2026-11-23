
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList implements OnInit {

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  successMessage = '';
  errorMessage = '';

  searchTerm = '';
  selectedDepartment = '';
  selectedStatus = '';

  isAdmin = false;
  username = '';
  userRole = '';
  fullName = '';

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) {
    this.setUserDetails();
  }

  ngOnInit(): void {
    this.setUserDetails();
    this.loadEmployees();
  }

  setUserDetails(): void {
    this.userRole = (this.authService.getRole() || '').toUpperCase();
    this.isAdmin = this.userRole === 'ADMIN';
    this.username = this.authService.getUsername() || 'User';
    this.fullName = this.authService.getFullName();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({

      next: (data: Employee[]) => {
        this.employees = data || [];
        this.updateFilteredEmployees();
        this.cdr.detectChanges();
      },

      error: (error: any) => {
        console.error('Error loading employees:', error);
        this.errorMessage = 'Unable to load employees.';
        this.cdr.detectChanges();
      }

    });
  }

  deactivateEmployee(id: number): void {

    if (!this.isAdmin) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to deactivate this employee?'
    );

    if (!confirmed) {
      return;
    }

    this.employeeService.deactivateEmployee(id).subscribe({

      next: (message: string) => {
        this.successMessage = message;
        this.errorMessage = '';
        this.loadEmployees();
      },

      error: (error: any) => {
        console.error('Error deactivating employee:', error);

        this.errorMessage =
          typeof error.error === 'string'
            ? error.error
            : 'Unable to deactivate employee.';

        this.successMessage = '';
        this.cdr.detectChanges();
      }

    });
  }

  editEmployee(id: number): void {

    if (!this.isAdmin) {
      return;
    }

    this.router.navigate(['/edit-employee', id]);
  }

  searchEmployees(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase().trim();
    this.updateFilteredEmployees();
  }

  clearSearch(input: HTMLInputElement): void {
    this.searchTerm = '';
    input.value = '';
    this.updateFilteredEmployees();
  }

  updateFilteredEmployees(): void {

    this.filteredEmployees = this.employees.filter(employee => {

      const matchesSearch =
        !this.searchTerm ||
        [
          employee.fullName,
          employee.email,
          employee.department,
          employee.designation
        ].some(value =>
          value?.toLowerCase().includes(this.searchTerm)
        );

      const matchesDepartment =
        !this.selectedDepartment ||
        employee.department === this.selectedDepartment;

      const matchesStatus =
        !this.selectedStatus ||
        (this.selectedStatus === 'Active' && employee.activeStatus) ||
        (this.selectedStatus === 'Inactive' && !employee.activeStatus);

      return matchesSearch && matchesDepartment && matchesStatus;

    });
  }

  clearFilters(): void {
    this.selectedDepartment = '';
    this.selectedStatus = '';
    this.updateFilteredEmployees();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
