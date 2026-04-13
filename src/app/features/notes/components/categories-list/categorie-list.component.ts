import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

import { NotesFecade } from '../../fecade/notes.fecade';
import type { Category, CategoryWithCount } from '../../models/category.model';

@Component({
  selector: 'app-categorie-list',
  templateUrl: './categorie-list.component.html',
  imports: [IonIcon, CommonModule],
})
export class CategorieListComponent {
  readonly fecade = inject(NotesFecade);
  @Input() categories: CategoryWithCount[] = [];

  @Output() categoryCreated = new EventEmitter<void>();
  @Output() categoryDisabled = new EventEmitter<Category>();
  @Output() editCategory = new EventEmitter<CategoryWithCount>();
  @Output() openModalCategorieCreate = new EventEmitter<void>();

  isSelected(id: string): boolean {
    return this.fecade.selectedCategoryIds().includes(id);
  }
  getTimeLabel(item: Category): string {
    const created = item.createdAt;
    const updated = item.updatedAt;

    const isUpdated = updated !== created;
    const time = isUpdated ? updated : created;

    const diff = Date.now() - time;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    let value = '';
    if (minutes < 1) {
      value = 'just now';
    } else if (minutes < 60) {
      value = `${minutes} min ago`;
    } else if (hours < 24) {
      value = `${hours} h ago`;
    } else {
      value = `${days} d ago`;
    }

    return `${isUpdated ? 'Updated' : 'Created'} ${value}`;
  }

  openModalCreateCategorie() {
    this.openModalCategorieCreate.emit();
  }

  trackById(_: number, item: Category): string {
    return item.id;
  }

  selectedCategorieToggle(category: Category) {
    this.fecade.toggleCategory(category);
  }
}
