import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { DashboardComponent } from './components/dashboard.component';
import { EmployeeListComponent } from './components/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/add', component: EmployeeFormComponent },
  { path: 'employees/edit/:id', component: EmployeeFormComponent },
  { path: '**', redirectTo: '/login' }
];
