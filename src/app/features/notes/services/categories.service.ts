import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';
import { StorageService } from 'src/app/core/services/storage.service';

import type { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private storage = inject(StorageService);

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.loadInitialCategories();
  }

  loadInitialCategories(): void {
    const stored = this.storage.get<Category[]>(STORAGE_KEYS.CATEGORIES) ?? [];
    this.categoriesSubject.next(stored);
  }

  add(name: string, color?: string): void {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: Date.now(),
    };

    const updated = [newCategory, ...this.categoriesSubject.value];
    this.updateState(updated);
  }

  update(id: string, changes: Partial<Category>): void {
    const updated = this.categoriesSubject.value.map((cat) =>
      cat.id === id ? { ...cat, ...changes } : cat,
    );

    this.updateState(updated);
  }

  delete(id: string): void {
    const updated = this.categoriesSubject.value.filter((cat) => cat.id !== id);

    this.updateState(updated);
  }

  private updateState(categories: Category[]): void {
    this.categoriesSubject.next(categories);
    this.storage.set(STORAGE_KEYS.CATEGORIES, categories);
  }
}
