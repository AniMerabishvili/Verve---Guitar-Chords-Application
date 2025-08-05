import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../shared/services/auth-service.service';
import { UserStateService, User } from '../shared/services/user-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  isLoggedIn = false;
  currentUser: User | null = null;
  private userSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    public userStateService: UserStateService, // Make it public for template access
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userStateService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = user !== null;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/sign-in']);
  }
}
