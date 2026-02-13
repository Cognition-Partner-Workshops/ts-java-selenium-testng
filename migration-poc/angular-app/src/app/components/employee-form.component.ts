import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  editMode = false;
  employeeId: number | null = null;
  name = '';
  email = '';
  department = '';
  salary = 0;
  errorMessage = '';
  successMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.employeeId = parseInt(id, 10);
      this.loadEmployee(this.employeeId);
    }
  }

  loadEmployee(id: number): void {
    this.employeeService.getEmployee(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.name = res.data.name;
          this.email = res.data.email;
          this.department = res.data.department;
          this.salary = res.data.salary;
        }
      },
      error: (err) => console.error('Failed to load employee', err)
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.name || !this.email || !this.department) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }
    const payload = { name: this.name, email: this.email, department: this.department, salary: this.salary };
    const request = this.editMode
      ? this.employeeService.updateEmployee(this.employeeId!, payload)
      : this.employeeService.createEmployee(payload);

    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = this.editMode ? 'Employee updated successfully!' : 'Employee added successfully!';
          setTimeout(() => { this.router.navigate(['/employees']); }, 1500);
        } else {
          this.errorMessage = res.message || 'Operation failed';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Connection error. Please try again.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
