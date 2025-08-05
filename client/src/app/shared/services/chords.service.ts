import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chords } from '../models/chords';

@Injectable({
  providedIn: 'root'
})
export class ChordsService {

  private url='http://localhost:3000/chords/all';
  private url1='http://localhost:3000/song/add';

  constructor(private http:HttpClient){ }

  public getChords(): Observable<Chords[]>{
    return this.http.get<Chords[]>(this.url);
}

public addChords(chords:Chords){
    return this.http.post<Chords>(this.url1, chords);
}   

}