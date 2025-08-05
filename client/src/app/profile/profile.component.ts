import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../shared/services/auth-service.service';
import { UserStateService, User } from '../shared/services/user-state.service';
import { SongService } from '../shared/services/song.service';
import { Song, SongStatus, SongStatusLabels } from '../shared/models/song';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  userSongs: Song[] = [];
  songsLoading = false;

  constructor(
    private authService: AuthServiceService,
    private userStateService: UserStateService,
    private songService: SongService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.user = this.userStateService.getCurrentUser();
    this.isLoading = false;

    if (!this.user) {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.loadUserSongs();
  }

  loadUserSongs(): void {
    this.songsLoading = true;
    this.songService.getUserSongs().subscribe({
      next: (songs: Song[]) => {
        this.userSongs = songs;
        this.songsLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading user songs:', error);
        this.songsLoading = false;
      }
    });
  }

  getPendingSongs(): Song[] {
    return this.userSongs.filter(song => song.status === SongStatus.PENDING);
  }

  getApprovedSongs(): Song[] {
    return this.userSongs.filter(song => song.status === SongStatus.APPROVED);
  }

  getRejectedSongs(): Song[] {
    return this.userSongs.filter(song => song.status === SongStatus.REJECTED);
  }

  getStatusLabel(status: number): string {
    return SongStatusLabels[status as SongStatus] || 'Unknown';
  }

  getStatusClass(status: number): string {
    switch (status) {
      case SongStatus.APPROVED:
        return 'bg-green-100 text-green-800 border-green-200';
      case SongStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case SongStatus.REJECTED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/sign-in']);
  }

  goBack(): void {
    this.router.navigate(['/landing-page']);
  }

  navigateToSignIn(): void {
    this.router.navigate(['/sign-in']);
  }
}
