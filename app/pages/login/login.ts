
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;

 if (response.role === 'ADMIN') {
  this.router.navigate(['/dashboard']);
} else if (response.role === 'EMPLOYEE') {
  this.router.navigate(['/employees']);
} else {
  this.authService.logout();
  this.errorMessage = 'Invalid user role.';
}

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Invalid username or password.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
