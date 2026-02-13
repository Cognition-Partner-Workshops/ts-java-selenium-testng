const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store (simulating SQL Server)
let users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'Admin' },
  { id: 2, username: 'user1', password: 'pass123', role: 'User' }
];

let employees = [
  { id: 1, name: 'John Smith', email: 'john@company.com', department: 'Engineering', salary: 85000 },
  { id: 2, name: 'Jane Doe', email: 'jane@company.com', department: 'Marketing', salary: 72000 },
  { id: 3, name: 'Bob Wilson', email: 'bob@company.com', department: 'Engineering', salary: 92000 },
  { id: 4, name: 'Alice Brown', email: 'alice@company.com', department: 'HR', salary: 68000 },
  { id: 5, name: 'Charlie Davis', email: 'charlie@company.com', department: 'Finance', salary: 78000 }
];

let nextEmployeeId = 6;

// ==================== API Routes ====================

// Auth API
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, user: { id: user.id, username: user.username, role: user.role }, token: 'mock-jwt-token-' + user.id });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Employees CRUD API
app.get('/api/employees', (req, res) => {
  res.json({ success: true, data: employees, total: employees.length });
});

app.get('/api/employees/:id', (req, res) => {
  const emp = employees.find(e => e.id === parseInt(req.params.id));
  if (emp) {
    res.json({ success: true, data: emp });
  } else {
    res.status(404).json({ success: false, message: 'Employee not found' });
  }
});

app.post('/api/employees', (req, res) => {
  const { name, email, department, salary } = req.body;
  if (!name || !email || !department) {
    return res.status(400).json({ success: false, message: 'Name, email, and department are required' });
  }
  const newEmployee = { id: nextEmployeeId++, name, email, department, salary: salary || 0 };
  employees.push(newEmployee);
  res.status(201).json({ success: true, data: newEmployee });
});

app.put('/api/employees/:id', (req, res) => {
  const idx = employees.findIndex(e => e.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Employee not found' });
  }
  const { name, email, department, salary } = req.body;
  employees[idx] = { ...employees[idx], name: name || employees[idx].name, email: email || employees[idx].email, department: department || employees[idx].department, salary: salary !== undefined ? salary : employees[idx].salary };
  res.json({ success: true, data: employees[idx] });
});

app.delete('/api/employees/:id', (req, res) => {
  const idx = employees.findIndex(e => e.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Employee not found' });
  }
  const deleted = employees.splice(idx, 1)[0];
  res.json({ success: true, data: deleted });
});

// Dashboard stats API
app.get('/api/dashboard/stats', (req, res) => {
  const totalEmployees = employees.length;
  const departments = [...new Set(employees.map(e => e.department))];
  const avgSalary = employees.reduce((sum, e) => sum + e.salary, 0) / totalEmployees;
  res.json({
    success: true,
    data: { totalEmployees, totalDepartments: departments.length, averageSalary: Math.round(avgSalary), departments }
  });
});

// ==================== View Routes (Simulating .NET MVC Views) ====================

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'views', 'login.html')); });
app.get('/login', (req, res) => { res.sendFile(path.join(__dirname, 'views', 'login.html')); });
app.get('/dashboard', (req, res) => { res.sendFile(path.join(__dirname, 'views', 'dashboard.html')); });
app.get('/employees', (req, res) => { res.sendFile(path.join(__dirname, 'views', 'employees.html')); });
app.get('/employees/add', (req, res) => { res.sendFile(path.join(__dirname, 'views', 'employee-form.html')); });

app.listen(PORT, () => {
  console.log(`Legacy .NET-style app running on http://localhost:${PORT}`);
});
