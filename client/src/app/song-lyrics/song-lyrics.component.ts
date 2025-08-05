import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SongService } from '../shared/services/song.service';
import { Song } from '../shared/models/song';

@Component({
  selector: 'app-song-lyrics',
  templateUrl: './song-lyrics.component.html',
  styleUrls: ['./song-lyrics.component.scss']
})
export class SongLyricsComponent implements OnInit {
  song: Song | null = null;
  segments: { chord: string, text: string }[] = [];

  constructor(private route: ActivatedRoute, private songService: SongService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const songId = params['id'];
      if (songId) {
        this.loadSongDetails(songId);
      }
    });
  }

  loadSongDetails(songId: string): void {
    this.songService.getSongById(songId).subscribe(song => {
      this.song = song;
      // Parse lyrics into segments
      this.segments = this.parseLyrics(song.lyrics);
    });
  }

  // Function to parse lyrics into segments of chord and text
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

    // Add any remaining text after the last chord
    const remainingText = lyrics.slice(lastIndex);
    if (remainingText) {
      segments.push({ chord: '', text: remainingText });
    }

    return segments;
  }
}
