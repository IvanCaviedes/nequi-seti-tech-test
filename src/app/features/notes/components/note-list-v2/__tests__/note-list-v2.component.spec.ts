import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NoteListV2Component } from '../note-list-v2.component';

describe('NoteListV2Component', () => {
  let component: NoteListV2Component;
  let fixture: ComponentFixture<NoteListV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteListV2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteListV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
