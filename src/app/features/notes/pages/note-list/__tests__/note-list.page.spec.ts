import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';

import { AuthFacade } from '../../../../auth/facade/auth.facade';
import { NotesFecade } from '../../../fecade/notes.fecade';
import type { CategoryWithCount } from '../../../models/category.model';
import type { NoteFilters } from '../../../models/note-filters.model';
import type { NoteWithCategory } from '../../../models/note.model';
import { NotePage } from '../note-list.page';

describe('NotePage (List)', () => {
  let component: NotePage;
  let fixture: ComponentFixture<NotePage>;

  let notesFacadeSpy: jasmine.SpyObj<NotesFecade>;
  let authFacadeSpy: jasmine.SpyObj<AuthFacade>;

  beforeEach(async () => {
    notesFacadeSpy = jasmine.createSpyObj<NotesFecade>('NotesFecade', [
      'setSearch',
      'setStatus',
      'toggleFavorites',
    ]);
    // Mocks de VM observables requeridas por los componentes hijos
    (notesFacadeSpy as any).notesVM$ = new BehaviorSubject<NoteWithCategory[]>([]).asObservable();
    (notesFacadeSpy as any).enableNewUI$ = new BehaviorSubject<boolean>(false).asObservable();
    (notesFacadeSpy as any).categoriesVM$ = new BehaviorSubject<CategoryWithCount[]>(
      [],
    ).asObservable();
    (notesFacadeSpy as any).filters$ = new BehaviorSubject<NoteFilters>({
      search: '',
      status: 'all',
      isFavorite: false,
      categoryIds: [],
    }).asObservable();
    (notesFacadeSpy as any).$stats = new BehaviorSubject<any>({}).asObservable();

    authFacadeSpy = jasmine.createSpyObj<AuthFacade>('AuthFacade', ['logout']);

    await TestBed.configureTestingModule({
      imports: [NotePage],
      providers: [
        { provide: NotesFecade, useValue: notesFacadeSpy },
        { provide: AuthFacade, useValue: authFacadeSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente e integrar componentes UI', () => {
    expect(component).toBeTruthy();
    expect(component.notes$).toBeDefined();
    expect(component.enableNewUI$).toBeDefined();
  });
});
