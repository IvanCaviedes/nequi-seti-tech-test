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

  private selectedCategoriesSubject = new BehaviorSubject<Category[]>([]);
  readonly selectedCategories$ = this.selectedCategoriesSubject.asObservable();

  constructor() {
    this.loadInitialCategories();
  }

  loadInitialCategories(): void {
    const stored = this.storage.get<Category[]>(STORAGE_KEYS.CATEGORIES) ?? [];
    this.categoriesSubject.next(stored);
  }

  add(name: string, color: string, icon: string): void {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      color,
      icon,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'active',
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

  selectedCategoryIds(): string[] {
    return this.selectedCategoriesSubject.value.map((c) => c.id);
  }

  toggleCategory(category: Category): void {
    const current = this.selectedCategoriesSubject.value;

    const exists = current.some((c) => c.id === category.id);

    if (exists) {
      this.selectedCategoriesSubject.next(current.filter((c) => c.id !== category.id));
    } else {
      this.selectedCategoriesSubject.next([...current, category]);
    }
  }

  removeSelectedCategory(id: string) {
    this.selectedCategoriesSubject.next(
      this.selectedCategoriesSubject.value.filter((c) => c.id !== id),
    );
  }

  clearSelectedCategories() {
    this.selectedCategoriesSubject.next([]);
  }
}
