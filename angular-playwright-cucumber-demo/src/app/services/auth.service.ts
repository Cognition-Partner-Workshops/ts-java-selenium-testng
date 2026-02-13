import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly validUsername = 'admin';
  private readonly validPassword = 'password123';
  private loggedIn = false;
  private currentUser = '';

  login(username: string, password: string): boolean {
    if (username === this.validUsername && password === this.validPassword) {
      this.loggedIn = true;
      this.currentUser = username;
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedIn = false;
    this.currentUser = '';
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUsername(): string {
    return this.currentUser;
  }
}
