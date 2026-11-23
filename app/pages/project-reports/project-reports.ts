
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface ProjectDetail {
  id: number;
  projectName: string;
  status: string;
  progress: number;
  assignedEmployees: number;
}

interface ProjectReport {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  plannedProjects: number;
  averageProgress: number;
  projectDetails: ProjectDetail[];
}

@Component({
  selector: 'app-project-reports',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-reports.html',
  styleUrl: './project-reports.css'
})
export class ProjectReports implements OnInit {

  report: ProjectReport | null = null;

  loading = true;
  errorMessage = '';

  private apiUrl = 'http://localhost:8080/api/projects/reports';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {

    this.loading = true;
    this.errorMessage = '';

    this.http.get<ProjectReport>(this.apiUrl).subscribe({

      next: (data) => {

        this.report = {
          ...data,
          projectDetails: data.projectDetails || []
        };

        this.loading = false;
        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Project report error:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load project reports.';

        this.loading = false;
        this.cdr.detectChanges();

      }

    });

  }

  getStatusClass(status: string): string {

    return status
      ? status.toLowerCase().replace(/_/g, '-')
      : '';

  }

  formatStatus(status: string): string {

    return status
      ? status.replace(/_/g, ' ')
      : 'Not set';

  }

  getProgressValue(progress: number): number {

    return Math.min(100, Math.max(0, progress || 0));

  }

}
