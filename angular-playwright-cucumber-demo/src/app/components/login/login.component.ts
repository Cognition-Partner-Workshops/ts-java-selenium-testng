import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  usernameError = '';
  passwordError = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  validateForm(): boolean {
    this.usernameError = '';
    this.passwordError = '';

    let valid = true;

    if (!this.username.trim()) {
      this.usernameError = 'Username is required';
      valid = false;
    }

    if (!this.password.trim()) {
      this.passwordError = 'Password is required';
      valid = false;
    } else if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      valid = false;
    }

    return valid;
  }

  onLogin(): void {
    this.errorMessage = '';

    if (!this.validateForm()) {
      return;
    }

    const success = this.authService.login(this.username, this.password);

    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
