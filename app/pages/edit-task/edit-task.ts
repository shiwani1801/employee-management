
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task';
import { ProjectService } from '../../services/project';
import { EmployeeService } from '../../services/employee';
import { Project } from '../../models/project';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.css'
})
export class EditTask implements OnInit {

  taskId!: number;

  task: Task = {
    title: '',
    description: '',
    startDate: '',
    deadline: '',
    status: 'PENDING'
  };

  projects: Project[] = [];
  employees: Employee[] = [];

  selectedProjectId: number | null = null;
  selectedEmployeeId: number | null = null;

  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadProjects();
    this.loadEmployees();
    this.loadTask();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: data => {
        this.projects = data;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Project loading error:', error);
        this.errorMessage = 'Unable to load projects.';
        this.cdr.detectChanges();
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: data => {
        this.employees = data;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Employee loading error:', error);
        this.errorMessage = 'Unable to load employees.';
        this.cdr.detectChanges();
      }
    });
  }

  loadTask(): void {
    this.taskService.getTaskById(this.taskId).subscribe({
      next: data => {
        this.task = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          startDate: data.startDate,
          deadline: data.deadline,
          status: data.status
        };

        this.selectedProjectId = data.project?.id ?? null;
        this.selectedEmployeeId = data.employee?.id ?? null;

        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Task loading error:', error);
        this.errorMessage = 'Unable to load task details.';
        this.cdr.detectChanges();
      }
    });
  }

  updateTask(): void {
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

    this.taskService.updateTask(this.taskId, this.task).subscribe({
      next: () => {
        alert('Task updated successfully!');
        this.loading = false;
        this.router.navigate(['/tasks']);
      },
      error: error => {
        console.error('Task update error:', error);
        this.errorMessage = 'Unable to update task.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
