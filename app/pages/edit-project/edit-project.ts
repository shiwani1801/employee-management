
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-project.html',
  styleUrl: './edit-project.css'
})
export class EditProject implements OnInit {

  projectId!: number;

  project: Project = {
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'PLANNED',
    progress: 0
  };

  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProject();
  }

  // Load existing project
  loadProject(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (data) => {
        this.project = {
          ...data,
          progress: data.progress ?? 0
        };
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.errorMessage = 'Unable to load project details.';
      }
    });
  }

  // Update project
  updateProject(): void {

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

    if (
      this.project.progress === undefined ||
      this.project.progress < 0 ||
      this.project.progress > 100
    ) {
      this.errorMessage = 'Progress must be between 0 and 100.';
      return;
    }

    this.projectService.updateProject(this.projectId, this.project).subscribe({
      next: () => {
        this.successMessage = 'Project updated successfully!';

        setTimeout(() => {
          this.router.navigate(['/projects']);
        }, 1000);
      },
      error: (error) => {
        console.error('Error updating project:', error);
        this.errorMessage = 'Unable to update project.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
