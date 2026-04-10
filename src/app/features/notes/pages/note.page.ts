import { Component, inject } from '@angular/core';

import { NoteCardComponent } from '../components/note-card.component';
import { NotesFecade } from '../fecade/notes.fecade';

@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  imports: [NoteCardComponent],
})
export class NotePage {
  private facade = inject(NotesFecade);

  notes$ = this.facade.$notes;
  categories$ = this.facade.$categories;
  stats$ = this.facade.$stats;

  addNote(): void {
    this.facade.addNote({
      title: 'New Note',
      content: 'This is a new note.',
      status: 'active',
      isFavorite: false,
    });
  }

  toggleFavorite(id: string): void {
    this.facade.toggleFavorite(id);
  }

  deleteNote(id: string): void {
    this.facade.deleteNote(id);
  }
}
