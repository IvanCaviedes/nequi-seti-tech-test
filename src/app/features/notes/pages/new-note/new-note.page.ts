/* eslint-disable @typescript-eslint/unbound-method */
import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { IonContent, IonIcon } from '@ionic/angular/standalone';

import { ROUTES } from 'src/app/core/constants/routes.constant';

import { TopBarComponent } from '../../components/topbar/topbar.component';
import { NotesFecade } from '../../fecade/notes.fecade';

@Component({
  selector: 'app-new-note',
  templateUrl: 'new-note.page.html',
  standalone: true,
  imports: [IonIcon, IonContent, CommonModule, ReactiveFormsModule, TopBarComponent],
})
export class NewNotePage implements OnInit {
  // =========================
  // 🔌 DEPENDENCIES
  // =========================
  private facade = inject(NotesFecade);
  private navCtrl = inject(NavController);
  private fb = inject(FormBuilder);

  // =========================
  // 📦 STATE
  // =========================
  readonly selectedCategories$ = this.facade.selectedCategoriesVM$;

  // =========================
  // 🧠 FORM
  // =========================
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
  });

  // =========================
  // 🧠 GUARD (NO CATEGORIES)
  // =========================
  ngOnInit(): void {
    this.selectedCategories$.subscribe((list) => {
      if (!list.length) {
        void this.navCtrl.navigateForward('/app/' + ROUTES.APP.ROOT);
      }
    });
  }

  // =========================
  // 🚀 CREATE TASK
  // =========================
  createTask() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const selectedIds = this.facade.selectedCategoryIds();

    if (!selectedIds.length) {
      return;
    }

    const value = this.form.value;

    this.facade.addNote({
      title: value.title!,
      content: value.description ?? '',
      categoryIds: selectedIds,
      status: 'active',
      isFavorite: false,
    });

    this.facade.clearSelectedCategories();

    void this.navCtrl.navigateForward('/app/' + ROUTES.APP.ROOT);
  }

  // =========================
  // 🧭 HELPERS
  // =========================
  get f() {
    return this.form.controls;
  }
}
