
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Project } from '../../models/project';
import { Employee } from '../../models/employee';

import { ProjectService } from '../../services/project';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-assignment.html',
  styleUrl: './employee-assignment.css'
})
export class EmployeeAssignment implements OnInit {

  projects: Project[] = [];
  employees: Employee[] = [];

  selectedProjectId: number | null = null;

  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadEmployees();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to load projects.';
        this.cdr.detectChanges();
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to load employees.';
        this.cdr.detectChanges();
      }
    });
  }

  getSelectedProject(): Project | undefined {
    return this.projects.find(
      project => project.id === Number(this.selectedProjectId)
    );
  }

  isEmployeeAssigned(employeeId: number): boolean {
    return this.getSelectedProject()?.employees?.some(
      employee => employee.id === employeeId
    ) ?? false;
  }

  onProjectChange(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  assignEmployee(employeeId: number): void {
    if (this.selectedProjectId === null) {
      this.errorMessage = 'Please select a project first.';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.projectService.assignEmployee(
      this.selectedProjectId,
      employeeId
    ).subscribe({
      next: () => {
        this.successMessage = 'Employee assigned successfully!';
        this.loading = false;
        this.loadProjects();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to assign employee.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  removeEmployee(employeeId: number): void {
    if (this.selectedProjectId === null) {
      return;
    }

    if (!confirm('Are you sure you want to remove this employee?')) {
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.projectService.removeEmployee(
      this.selectedProjectId,
      employeeId
    ).subscribe({
      next: () => {
        this.successMessage = 'Employee removed successfully!';
        this.loading = false;
        this.loadProjects();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to remove employee.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
