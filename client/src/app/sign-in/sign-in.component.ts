import { Component } from '@angular/core';
import { AuthServiceService } from '../shared/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  
  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  onSignIn() {
    if (!this.email || !this.password) {
      alert('Please enter both email and password');
      return;
    }

    this.authService.signIn(this.email, this.password).subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log('Login successful:', response);
          // Navigate to landing page after successful login
          this.router.navigate(['/landing-page']);
        } else {
          alert('Login failed: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Sign-in error:', error);
        if (error.status === 401) {
          alert('Invalid email or password');
        } else if (error.status === 0) {
          alert('Cannot connect to server. Please make sure the backend is running.');
        } else {
          alert('Login failed. Please try again.');
        }
      }
    });
  }
}
