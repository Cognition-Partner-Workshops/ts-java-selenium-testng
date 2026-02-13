import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { EmployeeService, Employee } from '../services/employee.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  successMessage = '';
  showDeleteModal = false;
  deleteId: number | null = null;

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
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (res) => { if (res.success) { this.employees = res.data; } },
      error: (err) => console.error('Failed to load employees', err)
    });
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }

  openDeleteModal(id: number): void {
    this.deleteId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.deleteId = null;
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (!this.deleteId) return;
    this.employeeService.deleteEmployee(this.deleteId).subscribe({
      next: (res) => {
        if (res.success) {
          this.closeDeleteModal();
          this.successMessage = 'Employee deleted successfully';
          setTimeout(() => { this.successMessage = ''; }, 3000);
          this.loadEmployees();
        }
      },
      error: (err) => console.error('Failed to delete employee', err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
