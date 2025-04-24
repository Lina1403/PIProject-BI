import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router) {}

  onLogin(): void {
    if (this.username === 'admin' && this.password === 'password') {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Incorrect username or password');
    }
  }
}
