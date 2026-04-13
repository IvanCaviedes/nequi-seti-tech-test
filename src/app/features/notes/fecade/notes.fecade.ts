import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

import { RemoteConfigService } from 'src/app/core/services/remote-config.service';

import type { Category } from '../models/category.model';
import type { NoteFilters } from '../models/note-filters.model';
import type { Note, NoteStatus } from '../models/note.model';
import { CategoriesService } from '../services/categories.service';
import { NotesService } from '../services/note.service';

@Injectable({ providedIn: 'root' })
export class NotesFecade {
  private readonly notesService = inject(NotesService);
  private readonly categoriesService = inject(CategoriesService);

  private featureFlags = inject(RemoteConfigService);
  readonly enableNewUI$ = this.featureFlags.flags$.pipe(
    map((flags) => flags['enableNewNotesUI'] ?? false),
  );

  $notes = this.notesService.notes$;
  $stats = this.notesService.stats$;
  $categories = this.categoriesService.categories$;
  $categoriesSelected = this.categoriesService.selectedCategories$;

  private filtersSubject = new BehaviorSubject<NoteFilters>({
    search: '',
    status: 'all',
    isFavorite: false,
    categoryIds: [],
  });

  filters$ = this.filtersSubject.asObservable();

  notesVM$ = combineLatest([
    this.notesService.notes$,
    this.categoriesService.categories$,
    this.filters$,
  ]).pipe(
    map(([notes, categories, filters]) => {
      let result = notes;

      // ❌ deleted siempre fuera
      result = result.filter((n) => n.status !== 'deleted');

      // 🔎 status filter
      if (filters.status !== 'all') {
        result = result.filter((n) => n.status === filters.status);
      }

      // ⭐ favorites
      if (filters.isFavorite) {
        result = result.filter((n) => n.isFavorite);
      }

      // 🔍 search
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();

        result = result.filter(
          (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q),
        );
      }

      // 🏷 tags/categories
      if (filters.categoryIds.length) {
        result = result.filter((n) =>
          n.categoryIds?.some((id) => filters.categoryIds.includes(id)),
        );
      }

      // 🔗 attach categories (como ya hacías antes)
      const categoryMap = new Map(categories.map((c) => [c.id, c]));

      return result.map((note) => ({
        ...note,
        categories: (note.categoryIds ?? []).map((id) => categoryMap.get(id)).filter(Boolean),
      }));
    }),
  );

  categoriesVM$ = combineLatest([this.$categories, this.$notes]).pipe(
    map(([categories, notes]) => {
      const { completedMap, countMap } = this.buildCountMap(notes);

      return categories
        .filter((c) => c.status !== 'disabled')
        .map((c) => this.enrichCategory(c, countMap, completedMap));
    }),
  );

  selectedCategoriesVM$ = combineLatest([this.$categoriesSelected, this.$notes]).pipe(
    map(([selected, notes]) => {
      const { countMap, completedMap } = this.buildCountMap(notes);

      return selected.map((c) => this.enrichCategory(c, countMap, completedMap));
    }),
  );

  private buildCountMap(notes: Note[]) {
    const countMap = new Map<string, number>();
    const completedMap = new Map<string, number>();
    for (const note of notes) {
      if (note.status === 'deleted') {
        continue;
      }

      for (const catId of note.categoryIds ?? []) {
        countMap.set(catId, (countMap.get(catId) ?? 0) + 1);

        if (note.status === 'completed') {
          completedMap.set(catId, (completedMap.get(catId) ?? 0) + 1);
        }
      }
    }

    return { countMap, completedMap };
  }

  private enrichCategory(
    category: Category,
    totalMap: Map<string, number>,
    completedMap: Map<string, number>,
  ) {
    const notesCount = totalMap.get(category.id) ?? 0;
    const completedCount = completedMap.get(category.id) ?? 0;

    return {
      ...category,
      notesCount,
      completedCount,
      canDelete: notesCount === 0,
    };
  }

  addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): void {
    this.notesService.add(note);
  }

  updateNote(id: string, changes: Partial<Note>): void {
    this.notesService.update(id, changes);
  }

  deleteNote(id: string): void {
    this.notesService.delete(id);
  }

  toggleFavorite(id: string): void {
    this.notesService.toggleFavorite(id);
  }

  toggleComplete(id: string): void {
    this.notesService.toggleComplete(id);
  }

  addCategory(name: string, color: string, icon: string): void {
    this.categoriesService.add(name, color, icon);
  }

  disableCategory(id: string) {
    this.categoriesService.update(id, { status: 'disabled' });
  }

  updateCategory(
    id: string,
    changes: Partial<{ name: string; color: string; icon: string }>,
  ): void {
    this.categoriesService.update(id, changes);
  }

  toggleCategory(category: Category): void {
    this.categoriesService.toggleCategory(category);
  }

  removeSelectedCategory(category: Category) {
    this.categoriesService.removeSelectedCategory(category.id);
  }

  selectedCategoryIds() {
    return this.categoriesService.selectedCategoryIds();
  }

  clearSelectedCategories() {
    this.categoriesService.clearSelectedCategories();
  }

  setSearch(search: string) {
    this.updateFilters({ search });
  }

  setStatus(status: NoteStatus) {
    this.updateFilters({ status });
  }

  toggleFavorites() {
    const current = this.filtersSubject.value;
    this.updateFilters({ isFavorite: !current.isFavorite });
  }

  toggleTag(tagId: string) {
    const current = this.filtersSubject.value;

    const exists = current.categoryIds.includes(tagId);

    this.updateFilters({
      categoryIds: exists
        ? current.categoryIds.filter((t) => t !== tagId)
        : [...current.categoryIds, tagId],
    });
  }

  private updateFilters(partial: Partial<NoteFilters>) {
    this.filtersSubject.next({
      ...this.filtersSubject.value,
      ...partial,
    });
  }
}
