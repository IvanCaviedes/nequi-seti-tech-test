import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { Note } from '../../models/note.model';
import { NoteCardComponent } from '../note-card/note-card.component';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, NoteCardComponent],
  templateUrl: './note-list.component.html',
})
export class NoteListComponent {
  @Input() notes: Note[] = [];
  @Input() loading = false;

  @Output() delete = new EventEmitter<string>();
  @Output() favorite = new EventEmitter<string>();
  @Output() open = new EventEmitter<string>();

  trackById(index: number, note: Note) {
    return note.id;
  }
}
