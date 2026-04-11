import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UiButtonComponent } from 'src/app/shared/ui/buttons/ui-button.component';
import { UiCardComponent } from 'src/app/shared/ui/cards/ui-card.component';
import { UiInputComponent } from 'src/app/shared/ui/inputs/ui-input.component';

import type { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, UiCardComponent, UiInputComponent, UiButtonComponent],
  templateUrl: './note-editor.component.html',
})
export class NoteEditorComponent implements OnInit {
  @Input() note?: Note;

  @Output() save = new EventEmitter<Partial<Note>>();
  @Output() cancelled = new EventEmitter<void>();

  title = '';
  content = '';
  category = '';

  ngOnInit() {
    if (this.note) {
      this.title = this.note.title;
      this.content = this.note.content;
    }
  }

  onSave() {
    this.save.emit({
      title: this.title,
      content: this.content,
      isFavorite: this.note?.isFavorite ?? false,
    });
  }
}
