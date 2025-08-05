import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../shared/services/song.service';
import { Song } from '../shared/models/song';

interface FormattedLine {
  chordLine: string;
  lyricsLine: string;
}

@Component({
  selector: 'app-song-lyrics',
  templateUrl: './song-lyrics.component.html',
  styleUrls: ['./song-lyrics.component.scss']
})
export class SongLyricsComponent implements OnInit {
  song: Song | null = null;
  segments: { chord: string, text: string }[] = [];
  formattedLines: FormattedLine[] = [];

  constructor(
    private route: ActivatedRoute, 
    private songService: SongService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const songId = params['id'];
      if (songId) {
        this.loadSongDetails(songId);
      }
    });
  }

  loadSongDetails(songId: string): void {
    this.songService.getSongById(songId).subscribe({
      next: (song) => {
        this.song = song;
        console.log('Loaded song:', song);
        
        // Parse lyrics into segments
        this.segments = this.parseLyrics(song.lyrics);
        console.log('Parsed segments:', this.segments);
        
        // Format for better display
        this.formattedLines = this.formatLyricsWithChords(song.lyrics);
        console.log('Formatted lines:', this.formattedLines);
      },
      error: (error) => {
        console.error('Error loading song:', error);
      }
    });
  }

  // Enhanced function to parse lyrics into segments of chord and text
  parseLyrics(lyrics: string): { chord: string, text: string }[] {
    if (!lyrics) {
      return [];
    }

    const segments: { chord: string, text: string }[] = [];
    const regex = /\[([^\]]+)\]/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(lyrics)) !== null) {
      const chord = match[1];
      const textBefore = lyrics.slice(lastIndex, match.index);

      // Add text segment if there's text before the chord
      if (textBefore.trim()) {
        segments.push({ chord: '', text: textBefore });
      }

      // Add chord segment
      segments.push({ chord, text: '' });
      lastIndex = regex.lastIndex;
    }

    // Add any remaining text after the last chord
    const remainingText = lyrics.slice(lastIndex);
    if (remainingText.trim()) {
      segments.push({ chord: '', text: remainingText });
    }

    return segments;
  }

  // New function to format lyrics with chords positioned above text
  formatLyricsWithChords(lyrics: string): FormattedLine[] {
    if (!lyrics) {
      return [];
    }

    const lines = lyrics.split('\n');
    const formattedLines: FormattedLine[] = [];

    lines.forEach(line => {
      if (!line.trim()) {
        // Empty line
        formattedLines.push({
          chordLine: '',
          lyricsLine: ''
        });
        return;
      }

      const chordPositions: { pos: number, chord: string }[] = [];
      const regex = /\[([^\]]+)\]/g;
      let match;
      let cleanLine = line;

      // Find all chord positions
      while ((match = regex.exec(line)) !== null) {
        chordPositions.push({
          pos: match.index,
          chord: match[1]
        });
      }

      // Remove chord brackets from the lyrics line
      cleanLine = line.replace(/\[([^\]]+)\]/g, '');

      if (chordPositions.length === 0) {
        // No chords in this line
        formattedLines.push({
          chordLine: '',
          lyricsLine: this.escapeHtml(cleanLine)
        });
        return;
      }

      // Build chord line with proper spacing
      let chordLine = '';
      let adjustedPos = 0;

      chordPositions.forEach((chordPos, index) => {
        // Calculate the actual position after removing previous chord brackets
        const bracketsBefore = chordPositions.slice(0, index).reduce((acc, cp) => acc + cp.chord.length + 2, 0);
        const actualPos = Math.max(0, chordPos.pos - bracketsBefore);

        // Add spaces to position the chord correctly
        while (chordLine.length < actualPos) {
          chordLine += '&nbsp;';
        }

        // Add the chord with styling
        const chordHtml = `<span class="chord text-[#4FE2D2] font-bold bg-[#4FE2D2]/10 px-1 rounded text-sm border border-[#4FE2D2]/30">${this.escapeHtml(chordPos.chord)}</span>`;
        chordLine += chordHtml;

        // Add some spacing after the chord to prevent overlap
        const chordLength = chordPos.chord.length;
        for (let i = 0; i < Math.max(1, chordLength - 2); i++) {
          chordLine += '&nbsp;';
        }
      });

      formattedLines.push({
        chordLine: chordLine,
        lyricsLine: this.escapeHtml(cleanLine)
      });
    });

    return formattedLines;
  }

  // Helper function to escape HTML
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Test function for development
  loadTestSong(): void {
    this.song = {
      _id: 'test',
      title: 'Test Song with Chords',
      lyrics: `[G]This is a [C]test song with [D]chords
[Em]You should see the [C]chords displayed [G]above [D]the lyrics
[Am]Each chord is [F]in square brackets [C]like this [G]one

[G]Here's another [D]line with some [Em]more chords [C]
[Am]And this line has [F]multiple [C]chords [G]in a row
[D]Pretty cool, [C]right? [G]

Verse 2:
[G]Now we're [C]getting to the [D]good part
[Em]Where the [C]music really [G]starts [D]
[Am]You can [F]play along [C]easily [G]now`
    };
    this.segments = this.parseLyrics(this.song.lyrics);
    this.formattedLines = this.formatLyricsWithChords(this.song.lyrics);
    console.log('Test segments:', this.segments);
    console.log('Test formatted lines:', this.formattedLines);
  }

  goBack(): void {
    this.router.navigate(['/landing-page']);
  }
}
