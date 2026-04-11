import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { UiButtonComponent } from 'src/app/shared/ui/buttons/ui-button.component';
import { UiCardComponent } from 'src/app/shared/ui/cards/ui-card.component';

import type { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiButtonComponent],
  templateUrl: './note-card.component.html',
})
export class NoteCardComponent {
  @Input() note!: Note;

  @Output() delete = new EventEmitter<string>();
  @Output() favorite = new EventEmitter<string>();
  @Output() open = new EventEmitter<string>();
}
