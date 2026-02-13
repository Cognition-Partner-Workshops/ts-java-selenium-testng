import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  averageSalary: number;
  departments: string[];
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(`${this.apiUrl}/api/employees`);
  }

  getEmployee(id: number): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/api/employees/${id}`);
  }

  createEmployee(employee: Partial<Employee>): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(`${this.apiUrl}/api/employees`, employee);
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(`${this.apiUrl}/api/employees/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<ApiResponse<Employee>> {
    return this.http.delete<ApiResponse<Employee>>(`${this.apiUrl}/api/employees/${id}`);
  }

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/api/dashboard/stats`);
  }
}
