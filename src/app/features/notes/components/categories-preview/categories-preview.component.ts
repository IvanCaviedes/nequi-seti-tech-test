import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

import type { CategoryWithCount } from '../../models/category.model';

@Component({
  selector: 'app-categorie-preview',
  templateUrl: './categories-preview.component.html',
  imports: [IonIcon, CommonModule],
})
export class CategoriePreviewComponent {
  @Input() category!: CategoryWithCount;
}
