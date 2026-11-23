
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TaskService } from '../../services/task';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-tasks.html',
  styleUrl: './my-tasks.css'
})
export class MyTasks implements OnInit {

  tasks: any[] = [];

  fullName = '';

  isLoading = false;

  errorMessage = '';
  successMessage = '';

  selectedStatuses: { [taskId: number]: string } = {};

  comments: { [taskId: number]: string } = {};

  taskComments: { [taskId: number]: any[] } = {};

  updatingTasks: { [taskId: number]: boolean } = {};

  addingComments: { [taskId: number]: boolean } = {};

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.fullName = this.authService.getFullName();
  }

  ngOnInit(): void {
    this.loadMyTasks();
  }

  // Load employee's assigned tasks
  loadMyTasks(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.getMyTasks().subscribe({

      next: (response: any[]) => {

        this.tasks = response || [];

        this.tasks.forEach(task => {

          this.selectedStatuses[task.id] = task.status;

          // Load saved comments for each task
          this.loadTaskComments(task.id);

        });

        this.isLoading = false;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('My tasks error:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load your tasks.';

        this.isLoading = false;

        this.cdr.detectChanges();

      }

    });

  }

  // Load saved comments
  loadTaskComments(taskId: number): void {

    this.taskService.getMyTaskComments(taskId).subscribe({

      next: (comments: any[]) => {

        this.taskComments[taskId] = comments || [];

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Loading comments error:', error);

        this.taskComments[taskId] = [];

        this.cdr.detectChanges();

      }

    });

  }

  // Update own task status
  updateStatus(taskId: number): void {

    const status = this.selectedStatuses[taskId];

    if (!status) {

      this.errorMessage = 'Please select a task status.';
      return;

    }

    if (this.updatingTasks[taskId]) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.updatingTasks[taskId] = true;

    this.taskService.updateMyTaskStatus(taskId, status).subscribe({

      next: (updatedTask: any) => {

        const task = this.tasks.find(t => t.id === taskId);

        if (task) {

          task.status = updatedTask.status;

          this.selectedStatuses[taskId] = updatedTask.status;

        }

        this.successMessage = 'Task status updated successfully.';

        this.updatingTasks[taskId] = false;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Status update error:', error);

        this.errorMessage =
          error.error?.message || 'Unable to update task status.';

        this.updatingTasks[taskId] = false;

        this.cdr.detectChanges();

      }

    });

  }

  // Add comment to own task
  addComment(taskId: number): void {

    const commentText = this.comments[taskId]?.trim();

    if (!commentText) {

      this.errorMessage = 'Please enter a comment.';
      return;

    }

    if (commentText.length > 1000) {

      this.errorMessage = 'Comment cannot exceed 1000 characters.';
      return;

    }

    if (this.addingComments[taskId]) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.addingComments[taskId] = true;

    this.taskService.addMyTaskComment(
      taskId,
      commentText
    ).subscribe({

      next: () => {

        this.comments[taskId] = '';

        this.successMessage = 'Comment added successfully.';

        this.addingComments[taskId] = false;

        // Reload comments after successful submission
        this.loadTaskComments(taskId);

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Comment error:', error);

        this.errorMessage =
          error.error?.message || 'Unable to add comment.';

        this.addingComments[taskId] = false;

        this.cdr.detectChanges();

      }

    });

  }

  // Back to employee page
  goBack(): void {
    this.router.navigate(['/employees']);
  }

  // Logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
