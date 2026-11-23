
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {

  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  projectOptions: { id: number; name: string }[] = [];

  loading = true;

  errorMessage = '';
  successMessage = '';

  searchTerm = '';
  selectedStatus = '';
  selectedPriority = '';
  selectedProject = '';

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  // Load all tasks
  loadTasks(): void {

    this.loading = true;
    this.errorMessage = '';

    this.taskService.getAllTasks().subscribe({

      next: (data: Task[]) => {

        this.tasks = data || [];

        this.loadProjectOptions();

        this.applyFilters();

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Task loading error:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load tasks.';

        this.loading = false;

        this.cdr.detectChanges();

      }

    });

  }

  // Create unique project list
  loadProjectOptions(): void {

    const projectMap = new Map<number, string>();

    this.tasks.forEach(task => {

      if (task.project?.id != null) {

        projectMap.set(
          task.project.id,
          task.project.projectName || 'Unnamed Project'
        );

      }

    });

    this.projectOptions = Array.from(
      projectMap.entries()
    ).map(([id, name]) => ({
      id,
      name
    }));

  }

  // Search and filter tasks
  applyFilters(): void {

    const search = this.searchTerm.toLowerCase().trim();

    this.filteredTasks = this.tasks.filter(task => {

      const matchesSearch =
        !search ||
        (task.title || '').toLowerCase().includes(search) ||
        (task.description || '').toLowerCase().includes(search) ||
        (task.project?.projectName || '').toLowerCase().includes(search) ||
        (task.employee?.fullName || '').toLowerCase().includes(search);

      const matchesStatus =
        !this.selectedStatus ||
        task.status === this.selectedStatus;

      const matchesPriority =
        !this.selectedPriority ||
        task.priority === this.selectedPriority;

      const matchesProject =
        !this.selectedProject ||
        String(task.project?.id) === this.selectedProject;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesProject
      );

    });

  }

  // Clear all filters
  clearFilters(): void {

    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedPriority = '';
    this.selectedProject = '';

    this.applyFilters();

  }

  // Delete task
  deleteTask(id: number): void {

    const confirmed = confirm(
      'Are you sure you want to delete this task?'
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.taskService.deleteTask(id).subscribe({

      next: () => {

        this.successMessage =
          'Task deleted successfully!';

        this.loadTasks();

      },

      error: (error) => {

        console.error('Task deletion error:', error);

        this.errorMessage =
          error.error?.message || 'Unable to delete task.';

        this.cdr.detectChanges();

      }

    });

  }

  // Display status properly
  formatStatus(status: string): string {

    return status
      ? status.replace(/_/g, ' ')
      : 'Not set';

  }

  // Status CSS class
  getStatusClass(status: string): string {

    return status
      ? status.toLowerCase().replace(/_/g, '-')
      : '';

  }

}
