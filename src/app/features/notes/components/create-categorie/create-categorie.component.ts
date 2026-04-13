/* eslint-disable @typescript-eslint/unbound-method */
import { CommonModule } from '@angular/common';
import type { OnChanges } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonModal, IonIcon } from '@ionic/angular/standalone';

import { NotesFecade } from '../../fecade/notes.fecade';
import type { CategoryWithCount } from '../../models/category.model';

@Component({
  selector: 'app-categorie-create-modal',
  templateUrl: './create-categorie.component.html',
  imports: [IonIcon, IonModal, CommonModule, ReactiveFormsModule],
})
export class CategorieCreateModalComponent implements OnChanges {
  ngOnChanges(): void {
    if (this.categoryToEdit) {
      this.form.patchValue({
        name: this.categoryToEdit.name,
        color: this.categoryToEdit.color,
        icon: this.categoryToEdit.icon,
      });
    }
  }
  // =========================
  // 📥 INPUT / OUTPUT
  // =========================
  @Input() isCreateCategoryOpen = false;
  @Output() categoryClosed = new EventEmitter<void>();
  @Input() categoryToEdit?: CategoryWithCount;

  // =========================
  // 🧠 DEPENDENCIES
  // =========================
  private facade = inject(NotesFecade);
  private fb = inject(FormBuilder);

  // =========================
  // 🧾 FORM
  // =========================
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    color: ['#6366f1', Validators.required],
    icon: ['folder-outline', Validators.required],
  });

  // =========================
  // 🎨 CONSTANTS
  // =========================
  readonly colors: string[] = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#f43f5e',
    '#3b82f6',
    '#06b6d4',
    '#14b8a6',
    '#10b981',
    '#84cc16',
    '#eab308',
    '#f59e0b',
    '#f97316',
    '#ef4444',
    '#64748b',
  ];

  readonly icons: string[] = [
    'grid-outline',
    'today-outline',
    'folder-outline',
    'folder-open-outline',
    'layers-outline',
    'briefcase-outline',
    'person-outline',
    'school-outline',
    'home-outline',
    'calendar-outline',
    'time-outline',
    'document-text-outline',
    'list-outline',
    'checkmark-done-outline',
    'check-circle-outline',
    'heart-outline',
    'flash-outline',
    'fitness-outline',
    'flag-outline',
    'pricetag-outline',
    'pricetags-outline',
    'cart-outline',
    'star',
    'star-outline',
    'albums-outline',
    'eye-outline',
    'eye-off-outline',
    'settings-outline',
    'menu-outline',
    'add-outline',
    'add-circle-outline',
    'close-outline',
    'chevron-back-outline',
    'chevron-forward-outline',
    'log-out-outline',
  ];

  // =========================
  // 🧠 GETTERS (LIMPIOS)
  // =========================
  get name() {
    return this.form.get('name');
  }

  get isValid(): boolean {
    return this.form.valid;
  }

  get isEditMode() {
    return !!this.categoryToEdit;
  }

  // =========================
  // 🎯 ACTIONS
  // =========================
  closeModal(): void {
    this.form.reset({
      name: '',
      color: '#6366f1',
      icon: 'folder-outline',
    });
    this.categoryClosed.emit();
  }

  createCategory(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, color, icon } = this.form.value;

    if (this.isEditMode) {
      this.facade.updateCategory(this.categoryToEdit!.id, {
        name: name!,
        color: color!,
        icon: icon!,
      });
    } else {
      this.facade.addCategory(name!, color!, icon!);
    }

    this.closeModal();
  }

  // =========================
  // 🎨 SELECTORS
  // =========================
  selectColor(color: string): void {
    this.form.patchValue({ color });
  }

  selectIcon(icon: string): void {
    this.form.patchValue({ icon });
  }
}
