import { Component } from '@angular/core';

import { NotesDashboardComponent } from '../components/notes-dashboard/notes-dashboard.component';

@Component({
  selector: 'app-note',
  templateUrl: 'note.page.html',
  imports: [NotesDashboardComponent],
})
export class NotePage {
  // private facade = inject(NotesFecade);
  // notes$ = this.facade.$notes;
  // categories$ = this.facade.$categories;
  // stats$ = this.facade.$stats;
  // addNote(): void {
  //   this.facade.addNote({
  //     title: 'New Note',
  //     content: 'This is a new note.',
  //     status: 'active',
  //     isFavorite: false,
  //   });
  // }
  // toggleFavorite(id: string): void {
  //   this.facade.toggleFavorite(id);
  // }
  // deleteNote(id: string): void {
  //   this.facade.deleteNote(id);
  // }
  // trackById(index: number, item: Note) {
  //   return item.id;
  // }
}
