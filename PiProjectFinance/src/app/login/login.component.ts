import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {
    this.isLoading = true;
    this.errorMessage = '';

    const credentials = { email: this.email, password: this.password };

    this.http.post<any>('http://localhost:5000/api/login', credentials).subscribe({
      next: (res) => {
        if (res && res.role) {
          // Save role and user info
          localStorage.setItem('role', res.role.toString());
          localStorage.setItem('user', JSON.stringify(res.user || { email: this.email }));

          // Redirect to dashboard
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid server response';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
        this.isLoading = false;
        console.error('Login error:', err);
      }
    });
  }
}
