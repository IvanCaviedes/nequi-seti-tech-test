import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { CategoryWithCount } from '../../../models/category.model';
import { CategoriePreviewComponent } from '../categories-preview.component';

const mockCategory: CategoryWithCount = {
  id: 'c1',
  name: 'Work',
  color: '#ff0000',
  icon: 'briefcase',
  status: 'active',
  createdAt: 0,
  updatedAt: 0,
  notesCount: 2,
  completedCount: 0,
  canDelete: true,
};

describe('CategoriePreviewComponent', () => {
  let component: CategoriePreviewComponent;
  let fixture: ComponentFixture<CategoriePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriePreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriePreviewComponent);
    component = fixture.componentInstance;
    component.category = mockCategory; // proveer @Input antes de detectChanges
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe recibir la categoría como @Input', () => {
    expect(component.category.id).toBe('c1');
    expect(component.category.name).toBe('Work');
  });
});
