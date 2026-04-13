import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

import { NotesFecade } from '../../fecade/notes.fecade';
import type { Category } from '../../models/category.model';
import type { NoteStatus } from '../../models/note.model';

@Component({
  selector: 'app-note-filters',
  templateUrl: './note-filters.component.html',
  imports: [IonIcon, CommonModule],
})
export class NoteFilterComponent {
  facade = inject(NotesFecade);

  categories$ = this.facade.categoriesVM$;
  filters$ = this.facade.filters$;

  // =========================
  // 🎯 ACTIONS
  // =========================
  setSearch(value: string) {
    this.facade.setSearch(value);
  }

  setStatus(status: NoteStatus) {
    this.facade.setStatus(status);
  }

  toggleFavorites() {
    this.facade.toggleFavorites();
  }

  toggleTag(tagId: string) {
    this.facade.toggleTag(tagId);
  }

  // =========================
  // 🧠 UI HELPERS
  // =========================
  trackById(_: number, item: Category) {
    return item.id;
  }
}
