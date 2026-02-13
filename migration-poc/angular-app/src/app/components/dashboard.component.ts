import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { EmployeeService, DashboardStats } from '../services/employee.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  username = '';

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const user = this.authService.getUser();
    this.username = user?.username || 'User';
    this.loadStats();
  }

  loadStats(): void {
    this.employeeService.getDashboardStats().subscribe({
      next: (res) => {
        if (res.success) { this.stats = res.data; }
      },
      error: (err) => console.error('Failed to load stats', err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
