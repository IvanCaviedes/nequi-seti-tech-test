import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NotesFecade } from '../../fecade/notes.fecade';
import { NoteEditorComponent } from '../note-editor/note-editor.component';
import { NoteListComponent } from '../note-list/note-list.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-notes-dashboard',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, NoteListComponent, NoteEditorComponent],
  templateUrl: './notes-dashboard.component.html',
})
export class NotesDashboardComponent {
  search = '';
  loading = false;

  private facade = inject(NotesFecade);

  notes$ = this.facade.$notes;
}
