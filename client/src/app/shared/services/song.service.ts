import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Song, SongStatus } from '../models/song';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getSong(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.url}/song/all`);
  }

  public getSongTitle(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.url}/song/title`);
  }

  getSongById(songId: string): Observable<Song> {
    return this.http.get<Song>(`${this.url}/song/${songId}`);
  }

  public addSong(song: Song): Observable<Song> {
    // No manual header here — interceptor will add token automatically
    return this.http.post<Song>(`${this.url}/song/add`, song);
  }

  public uploadSong(title: string, lyrics: string): Observable<Song> {
    const songData = { title, lyrics };
    // No manual header here — interceptor will add token automatically
    return this.http.post<Song>(`${this.url}/song/add`, songData);
  }

  public getPendingSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.url}/song/all2`);
  }

  public getUserSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.url}/song/user-songs`);
  }

  public approveSong(songId: string): Observable<Song> {
    return this.http.put<Song>(`${this.url}/song/${songId}/update`, { status: SongStatus.APPROVED });
  }

  public rejectSong(songId: string): Observable<Song> {
    return this.http.put<Song>(`${this.url}/song/${songId}/update`, { status: SongStatus.REJECTED });
  }
}