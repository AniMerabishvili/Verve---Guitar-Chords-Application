import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongLyricsComponent } from './song-lyrics.component';

describe('SongLyricsComponent', () => {
  let component: SongLyricsComponent;
  let fixture: ComponentFixture<SongLyricsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SongLyricsComponent]
    });
    fixture = TestBed.createComponent(SongLyricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
