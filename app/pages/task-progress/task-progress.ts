
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task';

interface ProjectProgress {
  projectId: number | string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  progressPercentage: number;
}

@Component({
  selector: 'app-task-progress',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-progress.html',
  styleUrl: './task-progress.css'
})
export class TaskProgress implements OnInit {

  tasks: Task[] = [];

  projectProgress: ProjectProgress[] = [];

  totalTasks = 0;
  pendingTasks = 0;
  inProgressTasks = 0;
  reviewTasks = 0;
  completedTasks = 0;
  overdueTasks = 0;

  loading = true;
  errorMessage = '';

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTaskProgress();
  }

  // Load all tasks
  loadTaskProgress(): void {

    this.loading = true;
    this.errorMessage = '';

    this.taskService.getAllTasks().subscribe({

      next: (data: Task[]) => {

        this.tasks = data || [];

        this.calculateStatistics();
        this.calculateProjectProgress();

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Task progress loading error:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load task progress.';

        this.loading = false;

        this.cdr.detectChanges();

      }

    });

  }

  // Calculate overall task statistics
  calculateStatistics(): void {

    this.totalTasks = this.tasks.length;

    this.pendingTasks = this.tasks.filter(
      task => task.status === 'TO_DO' ||
              task.status === 'PENDING'
    ).length;

    this.inProgressTasks = this.tasks.filter(
      task => task.status === 'IN_PROGRESS'
    ).length;

    this.reviewTasks = this.tasks.filter(
      task => task.status === 'REVIEW'
    ).length;

    this.completedTasks = this.tasks.filter(
      task => task.status === 'COMPLETED'
    ).length;

    const today = this.getTodayDate();

    this.overdueTasks = this.tasks.filter(task => {

      return !!task.deadline &&
        task.deadline < today &&
        task.status !== 'COMPLETED';

    }).length;

  }

  // Calculate project-wise progress
  calculateProjectProgress(): void {

    const projectMap = new Map<
      number | string,
      ProjectProgress
    >();

    this.tasks.forEach(task => {

      const projectId = task.project?.id ?? 'unassigned';

      const projectName =
        task.project?.projectName || 'Unassigned Tasks';

      if (!projectMap.has(projectId)) {

        projectMap.set(projectId, {
          projectId,
          projectName,
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          pendingTasks: 0,
          progressPercentage: 0
        });

      }

      const project = projectMap.get(projectId)!;

      project.totalTasks++;

      if (task.status === 'COMPLETED') {
        project.completedTasks++;
      } else if (task.status === 'IN_PROGRESS') {
        project.inProgressTasks++;
      } else if (
        task.status === 'TO_DO' ||
        task.status === 'PENDING'
      ) {
        project.pendingTasks++;
      }

    });

    this.projectProgress = Array.from(
      projectMap.values()
    ).map(project => {

      project.progressPercentage =
        project.totalTasks === 0
          ? 0
          : Math.round(
              (project.completedTasks / project.totalTasks) * 100
            );

      return project;

    });

  }

  // Overall completion percentage
  getProgressPercentage(): number {

    if (this.totalTasks === 0) {
      return 0;
    }

    return Math.round(
      (this.completedTasks / this.totalTasks) * 100
    );

  }

  // Today's date in YYYY-MM-DD format
  private getTodayDate(): string {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      today.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }

  // Format status
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

  // Check whether a task is overdue
  isOverdue(task: Task): boolean {

    return !!task.deadline &&
      task.deadline < this.getTodayDate() &&
      task.status !== 'COMPLETED';

  }

}
