import { APP_BASE_HREF } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { ROUTES } from 'src/app/core/constants/routes.constant';

import { NotesFecade } from '../../../fecade/notes.fecade';
import type { Category, CategoryWithCount } from '../../../models/category.model';
import { SelectCategoriesPage } from '../select-categories.page';

describe('SelectCategoriesPage', () => {
  let component: SelectCategoriesPage;
  let fixture: ComponentFixture<SelectCategoriesPage>;

  let facadeSpy: jasmine.SpyObj<NotesFecade>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    facadeSpy = jasmine.createSpyObj<NotesFecade>('NotesFecade', [
      'disableCategory',
      'removeSelectedCategory',
    ]);
    (facadeSpy as any).categoriesVM$ = new BehaviorSubject<CategoryWithCount[]>([]).asObservable();
    (facadeSpy as any).selectedCategoriesVM$ = new BehaviorSubject<CategoryWithCount[]>(
      [],
    ).asObservable();

    navCtrlSpy = jasmine.createSpyObj<NavController>('NavController', ['navigateForward']);

    await TestBed.configureTestingModule({
      imports: [SelectCategoriesPage],
      providers: [
        { provide: NotesFecade, useValue: facadeSpy },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectCategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('openCreateModal debe emitir true a isCreateModalOpen$', (done) => {
    component.openCreateModal();
    component.isCreateModalOpen$.subscribe((isOpen) => {
      expect(isOpen).toBeTrue();
      done();
    });
  });

  it('closeCreateModal debe emitir false a isCreateModalOpen$', (done) => {
    component.openCreateModal(); // primero lo abrimos
    component.closeCreateModal();
    component.isCreateModalOpen$.subscribe((isOpen) => {
      expect(isOpen).toBeFalse();
      done();
    });
  });

  it('disableCategorie debe inhabilitarla y removerla de seleccionados', () => {
    const mockCat = { id: 'x' } as Category;
    component.disableCategorie(mockCat);

    expect(facadeSpy.disableCategory).toHaveBeenCalledWith('x');
    expect(facadeSpy.removeSelectedCategory).toHaveBeenCalledWith(mockCat);
  });

  it('trackById debe devolver el id', () => {
    const mockCat = { id: 'track-123' } as Category;
    expect(component.trackById(0, mockCat)).toBe('track-123');
  });

  it('goToNew debe navegar a app/new', () => {
    component.goToNew();
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/app/' + ROUTES.APP.NEW);
  });

  it('editCategory debe asignar el category e invocar al modal', (done) => {
    const mockCat = { id: 'edit-c' } as CategoryWithCount;
    component.editCategory(mockCat);

    expect(component.selectedCategoryToEdit).toBe(mockCat);
    component.isCreateModalOpen$.subscribe((isOpen) => {
      expect(isOpen).toBeTrue();
      done();
    });
  });
});
