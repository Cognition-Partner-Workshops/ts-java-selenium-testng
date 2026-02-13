import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

const API_URL = process.env.LEGACY_URL || 'http://localhost:3000';

// ==================== API Contract Steps ====================

Given('the legacy .NET backend is running', async function (this: CustomWorld) {
  const response = await this.legacyPage.request.get(`${API_URL}/api/employees`);
  expect(response.ok()).toBeTruthy();
});

When('I send a login request with {string} and {string} to the API', async function (this: CustomWorld, username: string, password: string) {
  const response = await this.legacyPage.request.post(`${API_URL}/api/auth/login`, {
    data: { username, password }
  });
  const data = await response.json();
  this.apiResponses.set('login', { status: response.status(), data });
});

Then('the response should contain success, user object, and token', async function (this: CustomWorld) {
  const result = this.apiResponses.get('login');
  expect(result.data.success).toBe(true);
  expect(result.data.user).toBeTruthy();
  expect(result.data.user.id).toBeTruthy();
  expect(result.data.user.username).toBeTruthy();
  expect(result.data.user.role).toBeTruthy();
  expect(result.data.token).toBeTruthy();
});

Then('the response structure should match the expected contract', async function (this: CustomWorld) {
  const result = this.apiResponses.get('login');
  expect(typeof result.data.success).toBe('boolean');
  expect(typeof result.data.user.id).toBe('number');
  expect(typeof result.data.user.username).toBe('string');
  expect(typeof result.data.token).toBe('string');
});

When('I request the employees list from the API', async function (this: CustomWorld) {
  const response = await this.legacyPage.request.get(`${API_URL}/api/employees`);
  const data = await response.json();
  this.apiResponses.set('employees', { status: response.status(), data });
});

Then('the response should contain an array of employee objects', async function (this: CustomWorld) {
  const result = this.apiResponses.get('employees');
  expect(result.data.success).toBe(true);
  expect(Array.isArray(result.data.data)).toBe(true);
  expect(result.data.data.length).toBeGreaterThan(0);
});

Then('each employee should have id, name, email, department, and salary fields', async function (this: CustomWorld) {
  const result = this.apiResponses.get('employees');
  for (const emp of result.data.data) {
    expect(emp.id).toBeTruthy();
    expect(emp.name).toBeTruthy();
    expect(emp.email).toBeTruthy();
    expect(emp.department).toBeTruthy();
    expect(emp.salary !== undefined).toBe(true);
  }
});

When('I create a new employee via the API', async function (this: CustomWorld) {
  const response = await this.legacyPage.request.post(`${API_URL}/api/employees`, {
    data: { name: 'API Test User', email: 'apitest@company.com', department: 'Engineering', salary: 90000 }
  });
  const data = await response.json();
  this.apiResponses.set('createEmployee', { status: response.status(), data });
});

Then('the response should contain the created employee with an id', async function (this: CustomWorld) {
  const result = this.apiResponses.get('createEmployee');
  expect(result.data.success).toBe(true);
  expect(result.data.data.id).toBeTruthy();
  expect(result.data.data.name).toBe('API Test User');
});

Then('the response status should be {int}', async function (this: CustomWorld, status: number) {
  const result = this.apiResponses.get('createEmployee');
  expect(result.status).toBe(status);
});

When('I update an existing employee via the API', async function (this: CustomWorld) {
  // First get an existing employee to update
  const listRes = await this.legacyPage.request.get(`${API_URL}/api/employees`);
  const listData = await listRes.json();
  const firstEmp = listData.data[0];
  const response = await this.legacyPage.request.put(`${API_URL}/api/employees/${firstEmp.id}`, {
    data: { name: 'Updated Employee Name', salary: 95000 }
  });
  const data = await response.json();
  this.apiResponses.set('updateEmployee', { status: response.status(), data });
});

Then('the response should contain the updated employee data', async function (this: CustomWorld) {
  const result = this.apiResponses.get('updateEmployee');
  expect(result.data.success).toBe(true);
  expect(result.data.data).toBeTruthy();
});

Then('the modified fields should reflect the changes', async function (this: CustomWorld) {
  const result = this.apiResponses.get('updateEmployee');
  expect(result.data.data.name).toBe('Updated Employee Name');
  expect(result.data.data.salary).toBe(95000);
});

When('I delete an employee via the API', async function (this: CustomWorld) {
  // First create one to delete
  const createRes = await this.legacyPage.request.post(`${API_URL}/api/employees`, {
    data: { name: 'To Delete', email: 'delete@test.com', department: 'HR', salary: 50000 }
  });
  const created = await createRes.json();
  const deleteRes = await this.legacyPage.request.delete(`${API_URL}/api/employees/${created.data.id}`);
  const data = await deleteRes.json();
  this.apiResponses.set('deleteEmployee', { status: deleteRes.status(), data, deletedId: created.data.id });
});

Then('the response should confirm successful deletion', async function (this: CustomWorld) {
  const result = this.apiResponses.get('deleteEmployee');
  expect(result.data.success).toBe(true);
});

Then('the employee should no longer appear in the list', async function (this: CustomWorld) {
  const result = this.apiResponses.get('deleteEmployee');
  const listRes = await this.legacyPage.request.get(`${API_URL}/api/employees`);
  const listData = await listRes.json();
  const found = listData.data.find((e: any) => e.id === result.deletedId);
  expect(found).toBeFalsy();
});

When('I request the dashboard statistics from the API', async function (this: CustomWorld) {
  const response = await this.legacyPage.request.get(`${API_URL}/api/dashboard/stats`);
  const data = await response.json();
  this.apiResponses.set('dashboardStats', { status: response.status(), data });
});

Then('the response should contain totalEmployees, totalDepartments, and averageSalary', async function (this: CustomWorld) {
  const result = this.apiResponses.get('dashboardStats');
  expect(result.data.success).toBe(true);
  expect(result.data.data.totalEmployees).toBeTruthy();
  expect(result.data.data.totalDepartments).toBeTruthy();
  expect(result.data.data.averageSalary).toBeTruthy();
  expect(result.data.data.departments).toBeTruthy();
});
