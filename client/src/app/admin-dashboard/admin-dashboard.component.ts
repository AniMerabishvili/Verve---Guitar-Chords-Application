import { Component, OnInit } from '@angular/core';
import { SongService } from '../shared/services/song.service';
import { Song, SongStatus, SongStatusLabels } from '../shared/models/song';
import { UserStateService } from '../shared/services/user-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  pendingSongs: Song[] = [];
  loading = false;
  selectedSong: Song | null = null;
  showSongModal = false;

  constructor(
    private songService: SongService,
    private userStateService: UserStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is admin
    if (!this.userStateService.isAdmin()) {
      this.router.navigate(['/landing-page']);
      return;
    }

    this.loadPendingSongs();
  }

  loadPendingSongs(): void {
    this.loading = true;
    console.log('🔄 Loading pending songs...');
    this.songService.getPendingSongs().subscribe({
      next: (songs: Song[]) => {
        console.log('✅ Received pending songs:', songs);
        this.pendingSongs = songs;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('❌ Error loading pending songs:', error);
        this.loading = false;
      }
    });
  }

  viewSong(song: Song): void {
    console.log('👁️ Viewing song:', song);
    this.selectedSong = song;
    this.showSongModal = true;
  }

  approveSong(songId: string): void {
    if (!songId) {
      console.error('❌ No song ID provided for approval');
      return;
    }

    console.log('✅ Approving song with ID:', songId);
    this.loading = true;
    
    this.songService.approveSong(songId).subscribe({
      next: (updatedSong: Song) => {
        console.log('✅ Song approved successfully:', updatedSong);
        this.loading = false;
        this.loadPendingSongs(); // Reload the list
        this.closeModal();
        
        // Show success message (optional)
        alert('Song approved successfully!');
      },
      error: (error: any) => {
        console.error('❌ Error approving song:', error);
        this.loading = false;
        
        // Show error message
        alert('Error approving song. Please try again.');
      }
    });
  }

  rejectSong(songId: string): void {
    if (!songId) {
      console.error('❌ No song ID provided for rejection');
      return;
    }

    // Confirm rejection
    if (!confirm('Are you sure you want to reject this song?')) {
      return;
    }

    console.log('❌ Rejecting song with ID:', songId);
    this.loading = true;
    
    this.songService.rejectSong(songId).subscribe({
      next: (updatedSong: Song) => {
        console.log('❌ Song rejected successfully:', updatedSong);
        this.loading = false;
        this.loadPendingSongs(); // Reload the list
        this.closeModal();
        
        // Show success message (optional)
        alert('Song rejected successfully!');
      },
      error: (error: any) => {
        console.error('❌ Error rejecting song:', error);
        this.loading = false;
        
        // Show error message
        alert('Error rejecting song. Please try again.');
      }
    });
  }

  closeModal(): void {
    this.showSongModal = false;
    this.selectedSong = null;
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

  // Add this method for better performance
  trackBySongId(index: number, song: Song): string {
    return song._id;
  }

  // Helper method to safely format dates
  formatDate(dateString: string | undefined, format: 'short' | 'full' = 'short'): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (format === 'full') {
      return date.toLocaleString();
    }
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
} 