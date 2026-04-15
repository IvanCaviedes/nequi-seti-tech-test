import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NoteFilterComponent } from '../note-filters.component';

describe('NoteFilterComponent', () => {
  let component: NoteFilterComponent;
  let fixture: ComponentFixture<NoteFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
