import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserType } from '../models/user';
import { UserStateService, User } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private url = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private userStateService: UserStateService
  ) {}

  signIn(email: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.url}/user/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.success && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.userStateService.setUser(response.user);
          console.log('Sign-in successful:', response);
        }
      })
    );
  }

  register(firstName: string, lastName: string, userName: string, email: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.url}/user/add`, { firstName, lastName, userName, email, password }).pipe(
      tap((response: any) => {
        if (response.success && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.userStateService.setUser(response.user);
        }
      })
    );
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.httpClient.get(`${this.url}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userStateService.clearUser();
  }

  isLoggedIn(): boolean {
    return this.userStateService.isLoggedIn();
  }

  getCurrentUser(): User | null {
    return this.userStateService.getCurrentUser();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
