
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Project } from '../../models/project';
import { ProjectService } from '../../services/project';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css'
})
export class ProjectDetails implements OnInit {

  project: Project | null = null;

  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || isNaN(id)) {
      this.errorMessage = 'Invalid project ID.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.loadProjectDetails(id);
  }

  loadProjectDetails(id: number): void {

    this.loading = true;
    this.errorMessage = '';

    this.projectService.getProjectById(id).subscribe({

      next: (data) => {

        console.log('Project details received:', data);

        this.project = data;
        this.loading = false;

        // Refresh the page immediately
        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Project details error:', error);

        this.errorMessage = 'Unable to load project details.';
        this.loading = false;

        this.cdr.detectChanges();

      }

    });

  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

}
