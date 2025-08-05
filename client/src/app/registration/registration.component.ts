import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../shared/services/auth-service.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent{
  firstName: string = '';
  lastName: string = '';
  userName: string = '';
  email: string = '';
  password: string = '';

  constructor(private authService: AuthServiceService) {}

  register(): void {
    this.authService.register(this.firstName, this.lastName, this.userName, this.email, this.password).subscribe(
      (response) => {
        // Handle successful registration
        console.log('Registration successful:', response);
        // Clear the form fields
        this.resetForm();
      },
      (error) => {
        // Handle registration error
        console.error('Registration error:', error);
      }
    );
  }

  resetForm(): void {
    this.firstName = '';
    this.lastName = '';
    this.userName = '';
    this.email = '';
    this.password = '';
  }
}
