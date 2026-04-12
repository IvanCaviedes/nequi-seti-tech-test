import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { Note } from '../models/note.model';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
})
export class NoteCardComponent {
  @Input() note!: Note;

  @Output() delete = new EventEmitter<string>();
  @Output() favorite = new EventEmitter<string>();
}
