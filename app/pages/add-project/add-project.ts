
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-project.html',
  styleUrl: './add-project.css'
})
export class AddProject {

  project: Project = {
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'PLANNED'
  };

  successMessage = '';
  errorMessage = '';

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {}

  saveProject(): void {

    this.successMessage = '';
    this.errorMessage = '';

    if (!this.project.projectName.trim()) {
      this.errorMessage = 'Project name is required.';
      return;
    }

    if (this.project.startDate && this.project.endDate &&
        this.project.endDate < this.project.startDate) {
      this.errorMessage = 'End date cannot be before start date.';
      return;
    }

    this.projectService.addProject(this.project).subscribe({
      next: () => {
        this.successMessage = 'Project added successfully!';

        setTimeout(() => {
          this.router.navigate(['/projects']);
        }, 1000);
      },
      error: (error) => {
        console.error('Error adding project:', error);
        this.errorMessage = 'Unable to add project. Please try again.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
