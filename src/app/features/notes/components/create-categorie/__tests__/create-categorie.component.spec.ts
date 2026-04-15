import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { CategorieCreateModalComponent } from '../create-categorie.component';

describe('CategorieCreateModalComponent', () => {
  let component: CategorieCreateModalComponent;
  let fixture: ComponentFixture<CategorieCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieCreateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategorieCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
