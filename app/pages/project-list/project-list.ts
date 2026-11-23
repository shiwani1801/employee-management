
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-project-list',
  standalone: true,
imports: [CommonModule, RouterLink],  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectList implements OnInit {

  projects: Project[] = [];
  successMessage = '';
  errorMessage = '';

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  // Load all projects
  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        console.log('Projects received:', data);

        this.projects = data || [];
        this.errorMessage = '';

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.errorMessage = 'Unable to load projects.';
        this.cdr.markForCheck();
      }
    });
  }

  // Delete project
  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.successMessage = 'Project deleted successfully!';
          this.loadProjects();
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          this.errorMessage = 'Unable to delete project.';
        }
      });
    }
  }

  // Navigate to add project page
  addProject(): void {
    this.router.navigate(['/add-project']);
  }

  // Navigate to edit project page
  editProject(id: number): void {
    this.router.navigate(['/edit-project', id]);
  }

  // Navigate to project details page
  viewProjectDetails(id: number): void {
    this.router.navigate(['/project-details', id]);
  }

  // Navigate to employee assignment page
  manageAssignments(): void {
    this.router.navigate(['/employee-assignment']);
  }

  // Go back to employee list
  goBack(): void {
    this.router.navigate(['/employees']);
  }

}
