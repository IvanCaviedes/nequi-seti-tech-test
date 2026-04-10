import { Injectable, inject } from '@angular/core';

import type { Note } from '../models/note.model';
import { CategoriesService } from '../services/categories.service';
import { NotesService } from '../services/note.service';

@Injectable({ providedIn: 'root' })
export class NotesFecade {
  private readonly notesService = inject(NotesService);
  private readonly categoriesService = inject(CategoriesService);

  $notes = this.notesService.notes$;
  $stats = this.notesService.stats$;
  $categories = this.categoriesService.categories$;

  addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): void {
    this.notesService.add(note);
  }

  updateNote(id: string, changes: Partial<Note>): void {
    this.notesService.update(id, changes);
  }

  deleteNote(id: string): void {
    this.notesService.delete(id);
  }

  archiveNote(id: string): void {
    this.notesService.archive(id);
  }

  toggleFavorite(id: string): void {
    this.notesService.toggleFavorite(id);
  }

  addCategory(name: string, color?: string): void {
    this.categoriesService.add(name, color);
  }

  updateCategory(id: string, changes: Partial<{ name: string; color: string }>): void {
    this.categoriesService.update(id, changes);
  }

  deleteCategory(id: string): void {
    this.categoriesService.delete(id);
  }
}
