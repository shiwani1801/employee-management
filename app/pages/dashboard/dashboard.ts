
// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Employee } from '../../models/employee';
// import { EmployeeService } from '../../services/employee';
// import { Project } from '../../models/project';
// import { ProjectService } from '../../services/project';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './dashboard.html',
//   styleUrl: './dashboard.css'
// })
// export class Dashboard implements OnInit {

//   employees: Employee[] = [];
//   projects: Project[] = [];

//   // Employee statistics
//   totalEmployees = 0;
//   activeEmployees = 0;
//   inactiveEmployees = 0;
//   totalDepartments = 0;

//   departmentCounts: { department: string; count: number }[] = [];

//   // Project statistics
//   totalProjects = 0;
//   ongoingProjects = 0;
//   completedProjects = 0;
//   plannedProjects = 0;

//   // Project-wise employee count
//   projectEmployeeCounts: {
//     projectName: string;
//     employeeCount: number;
//     status: string;
//   }[] = [];

//   constructor(
//     private employeeService: EmployeeService,
//     private projectService: ProjectService,
//     private cdr: ChangeDetectorRef,
//     private router: Router,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     this.loadDashboardData();
//     this.loadProjectData();
//   }

//   // Load employee dashboard data
//   loadDashboardData(): void {
//     this.employeeService.getAllEmployees().subscribe({

//       next: (data) => {
//         this.employees = data || [];

//         this.totalEmployees = this.employees.length;

//         this.activeEmployees =
//           this.employees.filter(emp => emp.activeStatus).length;

//         this.inactiveEmployees =
//           this.employees.filter(emp => !emp.activeStatus).length;

//         const departments = [...new Set(
//           this.employees.map(emp => emp.department)
//         )];

//         this.totalDepartments = departments.length;

//         this.departmentCounts = departments.map(department => ({
//           department,
//           count: this.employees.filter(
//             emp => emp.department === department
//           ).length
//         }));

//         this.cdr.detectChanges();
//       },

//       error: (error) => {
//         console.error('Employee dashboard loading error:', error);
//       }

//     });
//   }

//   // Load project dashboard data
//   loadProjectData(): void {
//     this.projectService.getAllProjects().subscribe({

//       next: (data) => {
//         this.projects = data || [];

//         this.totalProjects = this.projects.length;

//         this.ongoingProjects = this.projects.filter(
//           project => project.status === 'IN_PROGRESS'
//         ).length;

//         this.completedProjects = this.projects.filter(
//           project => project.status === 'COMPLETED'
//         ).length;

//         this.plannedProjects = this.projects.filter(
//           project => project.status === 'PLANNED'
//         ).length;

//         this.projectEmployeeCounts = this.projects.map(project => ({
//           projectName: project.projectName,
//           employeeCount: project.employees?.length || 0,
//           status: project.status
//         }));

//         this.cdr.detectChanges();
//       },

//       error: (error) => {
//         console.error('Project dashboard loading error:', error);
//       }

//     });
//   }

//   goBack(): void {
//     this.router.navigate(['/employees']);
//   }

//   logout(): void {
//     this.authService.logout();
//     this.router.navigate(['/login']);
//   }
// }




import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  fullName = '';

  employees: Employee[] = [];
  projects: Project[] = [];

  totalEmployees = 0;
  activeEmployees = 0;
  inactiveEmployees = 0;
  totalDepartments = 0;

  departmentCounts: { department: string; count: number }[] = [];

  totalProjects = 0;
  ongoingProjects = 0;
  completedProjects = 0;
  plannedProjects = 0;

  projectEmployeeCounts: {
    projectName: string;
    employeeCount: number;
    status: string;
  }[] = [];

  constructor(
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fullName = this.authService.getFullName();

    this.loadDashboardData();
    this.loadProjectData();
  }

  loadDashboardData(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data || [];

        this.totalEmployees = this.employees.length;
        this.activeEmployees =
          this.employees.filter(emp => emp.activeStatus).length;
        this.inactiveEmployees =
          this.employees.filter(emp => !emp.activeStatus).length;

        const departments = [...new Set(
          this.employees.map(emp => emp.department)
        )];

        this.totalDepartments = departments.length;

        this.departmentCounts = departments.map(department => ({
          department,
          count: this.employees.filter(
            emp => emp.department === department
          ).length
        }));

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Employee dashboard loading error:', error);
      }
    });
  }

  loadProjectData(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data || [];

        this.totalProjects = this.projects.length;

        this.ongoingProjects = this.projects.filter(
          project => project.status === 'IN_PROGRESS'
        ).length;

        this.completedProjects = this.projects.filter(
          project => project.status === 'COMPLETED'
        ).length;

        this.plannedProjects = this.projects.filter(
          project => project.status === 'PLANNED'
        ).length;

        this.projectEmployeeCounts = this.projects.map(project => ({
          projectName: project.projectName,
          employeeCount: project.employees?.length || 0,
          status: project.status
        }));

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Project dashboard loading error:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
