import { HttpClient } from '@angular/common/http';
import { Component, ElementRef } from '@angular/core';
import { ChordsService } from '../shared/services/chords.service';
import { Chords } from '../shared/models/chords';
import { Song } from '../shared/models/song';
import { SongService } from '../shared/services/song.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-song-upload',
  templateUrl: './song-upload.component.html',
  styleUrls: ['./song-upload.component.scss']
})
export class SongUploadComponent {
  chords: Chords[] = [];
  songs: Song[] = [];
  lyrics = '';
  songName = '';
  selectedStart = 0;
  selectedEnd = 0;
  selectedChord = '';
  allChords: string[] = [];
  displayChords: boolean = false;
  songUploaded: boolean = false;
  lyricsWithChords: { chord: string, text: string }[] = [];

  constructor(
    private http: HttpClient,
    private elementRef: ElementRef,
    private chordsService: ChordsService,
    private songService: SongService,
    private router: Router
  ) {
    this.fetchAllChords();
  }

  ngOnInit(): void {
    this.loadChords();
    this.loadSongs();
  }

  loadChords() {
    this.chordsService.getChords().subscribe(c => {
      this.chords = c;
    });
  }

  loadSongs() {
    this.songService.getSong().subscribe(s => {
      this.songs = s;
    });
  }

  selectChord(chord: string) {
    this.selectedChord = chord;
    const textArea = this.elementRef.nativeElement.querySelector('#lyricsTextarea');
    if (textArea) {
      this.selectedStart = textArea.selectionStart;
      this.selectedEnd = textArea.selectionEnd;
      this.insertChordInLyrics();
    }
  }

  insertChordInLyrics() {
    const beforeSelection = this.lyrics.slice(0, this.selectedStart);
    const selectedText = this.lyrics.slice(this.selectedStart, this.selectedEnd);
    const afterSelection = this.lyrics.slice(this.selectedEnd);

    this.lyricsWithChords.push({ chord: this.selectedChord, text: selectedText });
    this.lyrics = `${beforeSelection}[${this.selectedChord}]${selectedText}${afterSelection}`;
  }

  fetchAllChords() {
    // this.http.get<string[]>('http://localhost:3000/chords/all').subscribe((chords) => {
    //   this.allChords = chords;
    // });
  }

  toggleDisplayChords() {
    this.displayChords = !this.displayChords;
  }

  uploadSong() {
    if (!this.songName.trim()) {
      alert('Please enter a song name');
      return;
    }

    if (!this.lyrics.trim()) {
      alert('Please enter song lyrics');
      return;
    }

    // Debug: Check if token exists and is valid
    const token = localStorage.getItem('token');
    console.log('Upload Song - Token exists:', !!token);
    console.log('Upload Song - Token value:', token);
    
    // Add additional validation
    if (!token) {
      alert('You must be signed in to upload songs. Please sign in first.');
      this.router.navigate(['/sign-in']);
      return;
    }

    this.songService.uploadSong(this.songName, this.lyrics).subscribe({
      next: (response) => {
        console.log('Song uploaded successfully:', response);
        this.songUploaded = true;
        
        // Clear form
        this.songName = '';
        this.lyrics = '';
        this.lyricsWithChords = [];
        
        // Show success message with admin review information
        alert('Song uploaded successfully! Your song has been sent to admin for review. You can check the status in your profile under "Your Songs".');
      },
      error: (error) => {
        console.error('Error uploading song:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Full error object:', error);
        
        if (error.status === 401) {
          alert('You are not authorized. Please sign in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.router.navigate(['/sign-in']);
        } else if (error.status === 500) {
          alert('Server error occurred. Please check your connection and try again. If the problem persists, contact support.');
        } else {
          alert('Error uploading song. Please try again.');
        }
      }
    });
  }

  parseLyrics(lyrics: string): { chord: string, text: string }[] {
    const segments: { chord: string, text: string }[] = [];
    const regex = /\[([^\]]+)\]/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(lyrics)) !== null) {
      const chord = match[1];
      const text = lyrics.slice(lastIndex, match.index);
      if (text) {
        segments.push({ chord: '', text });
      }
      segments.push({ chord, text: '' });
      lastIndex = regex.lastIndex;
    }

    const remainingText = lyrics.slice(lastIndex);
    if (remainingText) {
      segments.push({ chord: '', text: remainingText });
    }

    return segments;
  }

  goHomePage(): void {
    this.router.navigate(['./landing-page']);
  }
}