import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';
import { StorageService } from 'src/app/core/services/storage.service';

import type { NoteStats } from '../models/note-stats.model';
import type { Note } from '../models/note.model';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private storage = inject(StorageService);
  private notesSubject = new BehaviorSubject<Note[]>([]);
  notes$ = this.notesSubject.asObservable();

  constructor() {
    this.loadInitialNotes();
  }

  loadInitialNotes() {
    const stored = this.storage.get<Note[]>(STORAGE_KEYS.NOTES) ?? [];
    this.notesSubject.next(stored);
  }

  add(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): void {
    const now = Date.now();

    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newNote, ...this.notesSubject.value];
    this.updateState(updated);
  }

  update(id: string, changes: Partial<Note>): void {
    const updated = this.notesSubject.value.map((note) =>
      note.id === id ? { ...note, ...changes, updatedAt: Date.now() } : note,
    );

    this.updateState(updated);
  }

  delete(id: string): void {
    this.update(id, { status: 'deleted' });
  }

  toggleFavorite(id: string): void {
    const note = this.notesSubject.value.find((n) => n.id === id);
    if (!note) {
      return;
    }

    this.update(id, { isFavorite: !note.isFavorite });
  }

  toggleComplete(id: string): void {
    const note = this.notesSubject.value.find((n) => n.id === id);
    if (!note) {
      return;
    }

    this.update(id, { status: note.status === 'completed' ? 'active' : 'completed' });
  }
  private updateState(notes: Note[]): void {
    this.notesSubject.next(notes);
    this.storage.set(STORAGE_KEYS.NOTES, notes);
  }

  private calculateStats(notes: Note[]): NoteStats {
    return {
      total: notes.length,
      active: notes.filter((n) => n.status === 'active').length,
      completed: notes.filter((n) => n.status === 'completed').length,
      deleted: notes.filter((n) => n.status === 'deleted').length,
      favorites: notes.filter((n) => n.isFavorite).length,
    };
  }

  stats$ = this.notes$.pipe(map((notes) => this.calculateStats(notes)));
}
