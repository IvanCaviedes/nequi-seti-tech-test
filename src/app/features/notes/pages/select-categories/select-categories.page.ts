import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { BehaviorSubject } from 'rxjs';

import { ROUTES } from 'src/app/core/constants/routes.constant';

import { CategorieListComponent } from '../../components/categories-list/categorie-list.component';
import { CategoriePreviewComponent } from '../../components/categories-preview/categories-preview.component';
import { CategorieCreateModalComponent } from '../../components/create-categorie/create-categorie.component';
import { TopBarComponent } from '../../components/topbar/topbar.component';
import { NotesFecade } from '../../fecade/notes.fecade';
import type { Category, CategoryWithCount } from '../../models/category.model';

@Component({
  selector: 'app-select-categories',
  templateUrl: 'select-categories.page.html',
  imports: [
    IonIcon,
    IonContent,
    TopBarComponent,
    CommonModule,
    CategorieListComponent,
    CategoriePreviewComponent,
    CategorieCreateModalComponent,
  ],
})
export class SelectCategoriesPage {
  // =========================
  // 🧠 DEPENDENCIES
  // =========================
  private facade = inject(NotesFecade);
  private navCtrl = inject(NavController);

  // =========================
  // 📦 DATA
  // =========================
  readonly categories$ = this.facade.categoriesVM$;
  readonly seleted$ = this.facade.selectedCategoriesVM$;

  // =========================
  // 🎯 STATE
  // =========================

  private isCreateModalOpenSubject = new BehaviorSubject<boolean>(false);
  readonly isCreateModalOpen$ = this.isCreateModalOpenSubject.asObservable();

  selectedCategoryToEdit!: CategoryWithCount;

  // =========================
  // 🪟 MODAL
  // =========================
  openCreateModal(): void {
    this.isCreateModalOpenSubject.next(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpenSubject.next(false);
  }

  disableCategorie(category: Category) {
    this.facade.disableCategory(category.id);
    this.facade.removeSelectedCategory(category);
  }

  trackById(_: number, item: Category): string {
    return item.id;
  }

  goToNew() {
    void this.navCtrl.navigateForward('/app/' + ROUTES.APP.NEW);
  }

  editCategory(category: CategoryWithCount) {
    this.selectedCategoryToEdit = category;
    this.isCreateModalOpenSubject.next(true);
  }
}
