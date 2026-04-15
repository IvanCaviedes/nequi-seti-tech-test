import { APP_BASE_HREF } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { ROUTES } from 'src/app/core/constants/routes.constant';

import { NotesFecade } from '../../../fecade/notes.fecade';
import type { Category } from '../../../models/category.model';
import { NewNotePage } from '../new-note.page';

describe('NewNotePage', () => {
  let component: NewNotePage;
  let fixture: ComponentFixture<NewNotePage>;
  let facadeSpy: jasmine.SpyObj<NotesFecade>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;

  const mockCategories$ = new BehaviorSubject<Category[]>([]);

  beforeEach(async () => {
    facadeSpy = jasmine.createSpyObj<NotesFecade>('NotesFecade', [
      'addNote',
      'selectedCategoryIds',
      'clearSelectedCategories',
    ]);
    // Asignar el observable
    (facadeSpy as any).selectedCategoriesVM$ = mockCategories$.asObservable();
    facadeSpy.selectedCategoryIds.and.returnValue([]);

    navCtrlSpy = jasmine.createSpyObj<NavController>('NavController', ['navigateForward']);

    await TestBed.configureTestingModule({
      imports: [NewNotePage],
      providers: [
        FormBuilder,
        { provide: NotesFecade, useValue: facadeSpy },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NewNotePage);
    component = fixture.componentInstance;

    // Set initial mock state before ngOnInit executes
    mockCategories$.next([
      {
        id: 'cat1',
        name: 'Work',
        color: 'red',
        icon: 'briefcase',
        status: 'active',
        createdAt: 0,
        updatedAt: 0,
      },
    ]);

    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit behavior', () => {
    it('debe navegar a dashboard si no hay categorías seleccionadas', fakeAsync(() => {
      // Forzamos un arreglo vacío
      mockCategories$.next([]);
      tick();
      expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/app/' + ROUTES.APP.ROOT);
    }));
  });

  describe('Form', () => {
    it('debe marcar los controles como inválidos al enviar formulario vacío', () => {
      component.createTask();
      expect(component.form.controls.title.touched).toBeTrue();
      expect(component.form.controls.description.touched).toBeTrue();
      expect(facadeSpy.addNote).not.toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    beforeEach(() => {
      component.form.patchValue({
        title: 'Mi Nota',
        description: 'Detalle de la nota',
      });
    });

    it('no debe hacer nada si no hay categorías seleccionadas en el facade (falla de estado)', () => {
      facadeSpy.selectedCategoryIds.and.returnValue([]);
      component.createTask();
      expect(facadeSpy.addNote).not.toHaveBeenCalled();
    });

    it('debe llamar a addNote, limpiar categories y navegar con un formulario válido', () => {
      facadeSpy.selectedCategoryIds.and.returnValue(['cat1']);
      component.createTask();

      expect(facadeSpy.addNote).toHaveBeenCalledWith({
        title: 'Mi Nota',
        content: 'Detalle de la nota',
        categoryIds: ['cat1'],
        status: 'active',
        isFavorite: false,
      });
      expect(facadeSpy.clearSelectedCategories).toHaveBeenCalled();
      expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/app/' + ROUTES.APP.ROOT);
    });
  });
});
