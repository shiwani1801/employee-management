
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task';
import { ProjectService } from '../../services/project';
import { EmployeeService } from '../../services/employee';
import { Project } from '../../models/project';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css'
})
export class AddTask implements OnInit {

  projects: Project[] = [];
  employees: Employee[] = [];

  task: Task = {
    title: '',
    description: '',
    startDate: '',
    deadline: '',
    status: 'PENDING'
  };

  selectedProjectId: number | null = null;
  selectedEmployeeId: number | null = null;

  loading = false;
  errorMessage = '';

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadEmployees();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Project loading error:', error);
        this.errorMessage = 'Unable to load projects.';
        this.cdr.detectChanges();
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Employee loading error:', error);
        this.errorMessage = 'Unable to load employees.';
        this.cdr.detectChanges();
      }
    });
  }

  addTask(): void {
    this.errorMessage = '';

    if (
      !this.task.title.trim() ||
      !this.task.startDate ||
      !this.task.deadline ||
      !this.selectedProjectId ||
      !this.selectedEmployeeId
    ) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    if (this.task.deadline < this.task.startDate) {
      this.errorMessage = 'Deadline cannot be before the start date.';
      return;
    }

    this.task.project = { id: this.selectedProjectId } as Project;
    this.task.employee = { id: this.selectedEmployeeId } as Employee;

    this.loading = true;

    this.taskService.addTask(this.task).subscribe({
      next: () => {
        alert('Task added successfully!');
        this.loading = false;
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Task creation error:', error);
        this.errorMessage = 'Unable to add task. Please check the selected project and employee.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
