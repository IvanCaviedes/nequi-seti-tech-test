import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

import { RemoteConfigService } from 'src/app/core/services/remote-config.service';

import type { Category } from '../../models/category.model';
import type { NoteStats } from '../../models/note-stats.model';
import type { Note } from '../../models/note.model';
import { CategoriesService } from '../../services/categories.service';
import { NotesService } from '../../services/note.service';
import { NotesFecade } from '../notes.fecade';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: crypto.randomUUID(),
    title: 'Nota',
    content: 'Contenido',
    status: 'active',
    isFavorite: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    categoryIds: [],
    ...overrides,
  };
}

function makeCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: crypto.randomUUID(),
    name: 'Cat',
    color: '#fff',
    icon: '🏷',
    status: 'active',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

// ─── Mocks ────────────────────────────────────────────────────────────────────

class RemoteConfigServiceMock {
  flags$ = new BehaviorSubject<Record<string, boolean>>({ enableNewNotesUI: false });
  setFlag(flag: string, value: boolean) {
    this.flags$.next({ ...this.flags$.value, [flag]: value });
  }
  isEnabled(_flag: string) {
    return false;
  }
}

describe('NotesFecade', () => {
  let facade: NotesFecade;
  let notesSubject: BehaviorSubject<Note[]>;
  let categoriesSubject: BehaviorSubject<Category[]>;
  let selectedCategoriesSubject: BehaviorSubject<Category[]>;
  let remoteConfigMock: RemoteConfigServiceMock;

  // Mocks de los servicios
  let notesServiceMock: Partial<NotesService>;
  let categoriesServiceMock: Partial<CategoriesService>;

  beforeEach(() => {
    notesSubject = new BehaviorSubject<Note[]>([]);
    categoriesSubject = new BehaviorSubject<Category[]>([]);
    selectedCategoriesSubject = new BehaviorSubject<Category[]>([]);
    remoteConfigMock = new RemoteConfigServiceMock();

    // stats$ derivado de notesSubject (igual que la implementación real)
    const statsSubject = new BehaviorSubject<NoteStats>({
      total: 0,
      active: 0,
      completed: 0,
      deleted: 0,
      favorites: 0,
    });

    notesServiceMock = {
      notes$: notesSubject.asObservable(),
      stats$: statsSubject.asObservable(),
      add: jasmine
        .createSpy('add')
        .and.callFake((note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
          const newNote = {
            ...note,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          } as Note;
          notesSubject.next([newNote, ...notesSubject.value]);
        }),
      update: jasmine.createSpy('update').and.callFake((id: string, changes: Partial<Note>) => {
        notesSubject.next(notesSubject.value.map((n) => (n.id === id ? { ...n, ...changes } : n)));
      }),
      delete: jasmine.createSpy('delete'),
      toggleFavorite: jasmine.createSpy('toggleFavorite'),
      toggleComplete: jasmine.createSpy('toggleComplete'),
      loadInitialNotes: jasmine.createSpy('loadInitialNotes'),
    };

    categoriesServiceMock = {
      categories$: categoriesSubject.asObservable(),
      selectedCategories$: selectedCategoriesSubject.asObservable(),
      add: jasmine.createSpy('add'),
      update: jasmine.createSpy('update'),
      delete: jasmine.createSpy('delete'),
      toggleCategory: jasmine.createSpy('toggleCategory'),
      removeSelectedCategory: jasmine.createSpy('removeSelectedCategory'),
      clearSelectedCategories: jasmine.createSpy('clearSelectedCategories'),
      selectedCategoryIds: jasmine.createSpy('selectedCategoryIds').and.returnValue([]),
    };

    TestBed.configureTestingModule({
      providers: [
        NotesFecade,
        { provide: NotesService, useValue: notesServiceMock },
        { provide: CategoriesService, useValue: categoriesServiceMock },
        { provide: RemoteConfigService, useValue: remoteConfigMock },
      ],
    });

    facade = TestBed.inject(NotesFecade);
  });

  // ─── enableNewUI$ ──────────────────────────────────────────────────────────

  describe('enableNewUI$', () => {
    it('debe ser false por defecto', (done) => {
      facade.enableNewUI$.pipe(first()).subscribe((val) => {
        expect(val).toBeFalse();
        done();
      });
    });

    it('debe reflejar el cambio del flag remoto', (done) => {
      remoteConfigMock.setFlag('enableNewNotesUI', true);
      facade.enableNewUI$.pipe(first()).subscribe((val) => {
        expect(val).toBeTrue();
        done();
      });
    });
  });

  // ─── notesVM$ — sin filtros ────────────────────────────────────────────────

  describe('notesVM$ (sin filtros)', () => {
    it('debe retornar todas las notas sin filtrado', (done) => {
      const cat = makeCategory({ id: 'cat-1' });
      const nota = makeNote({ categoryIds: ['cat-1'] });

      categoriesSubject.next([cat]);
      notesSubject.next([nota]);

      facade.notesVM$.pipe(first()).subscribe((notas) => {
        expect(notas.length).toBe(1);
        expect(notas[0].id).toBe(nota.id);
        done();
      });
    });

    it('debe enriquecer las notas con sus objetos Category', (done) => {
      const cat = makeCategory({ id: 'enrich-cat', name: 'Trabajo' });
      const nota = makeNote({ categoryIds: ['enrich-cat'] });

      categoriesSubject.next([cat]);
      notesSubject.next([nota]);

      facade.notesVM$.pipe(first()).subscribe((notas) => {
        expect(notas[0].categories.length).toBe(1);
        expect((notas[0].categories[0] as Category).name).toBe('Trabajo');
        done();
      });
    });
  });

  // ─── notesVM$ — filtro por status ─────────────────────────────────────────

  describe('notesVM$ — filtro status', () => {
    beforeEach(() => {
      notesSubject.next([
        makeNote({ title: 'Activa', status: 'active' }),
        makeNote({ title: 'Completada', status: 'completed' }),
        makeNote({ title: 'Eliminada', status: 'deleted' }),
      ]);
    });

    it('debe retornar solo notas activas con status=active', (done) => {
      facade.setStatus('active');
      facade.notesVM$.pipe(first()).subscribe((notas) => {
        expect(notas.every((n) => n.status === 'active')).toBeTrue();
        done();
      });
    });

    it('debe retornar solo notas completadas con status=completed', (done) => {
      facade.setStatus('completed');
      facade.notesVM$.pipe(first()).subscribe((notas) => {
        expect(notas.every((n) => n.status === 'completed')).toBeTrue();
        done();
      });
    });

    it('debe retornar todas las notas con status=all', (done) => {
      facade.setStatus('all');
      facade.notesVM$.pipe(first()).subscribe((notas) => {
        expect(notas.length).toBe(3);
        done();
      });
    });
  });

  // ─── notesVM$ — filtro isFavorite ─────────────────────────────────────────

  describe('notesVM$ — filtro isFavorite', () => {
    beforeEach(() => {
      notesSubject.next([
        makeNote({ title: 'Favorita', isFavorite: true }),
        makeNote({ title: 'Normal', isFavorite: false }),
      ]);
    });

    it('debe retornar solo favoritas cuando el filtro está activado', (done) => {
      facade.toggleFavorites();
      facade.notesVM$.pipe(first()).subscribe((notas) => {
        expect(notas.every((n) => n.isFavorite)).toBeTrue();
        done();
      });
    });

    it('debe retornar todas las notas cuando el filtro está desactivado', (done) => {
      facade.notesVM$.pipe(first()).subscribe((notas) => {
        expect(notas.length).toBe(2);
        done();
      });
    });
  });

  // ─── notesVM$ — filtro search ─────────────────────────────────────────────

  describe('notesVM$ — filtro search', () => {
    beforeEach(() => {
      notesSubject.next([
        makeNote({ title: 'Angular es genial', content: 'frontend' }),
        makeNote({ title: 'React', content: 'también frontend' }),
        makeNote({ title: 'Backend', content: 'node.js es genial' }),
      ]);
    });

    it('debe filtrar por título (case insensitive)', (done) => {
      facade.setSearch('angular');
      facade.notesVM$.pipe(first()).subscribe((notas) => {
        expect(notas.length).toBe(1);
        expect(notas[0].title).toContain('Angular');
        done();
      });
    });

    it('debe filtrar por contenido', (done) => {
      facade.setSearch('node.js');
      facade.notesVM$.pipe(first()).subscribe((notas) => {
        expect(notas.length).toBe(1);
        expect(notas[0].title).toBe('Backend');
        done();
      });
    });

    it('debe retornar todas con búsqueda vacía', (done) => {
      facade.setSearch('');
      facade.notesVM$.pipe(first()).subscribe((notas) => {
        expect(notas.length).toBe(3);
        done();
      });
    });
  });

  // ─── notesVM$ — filtro por categoryIds ────────────────────────────────────

  describe('notesVM$ — filtro categoryIds', () => {
    it('debe retornar solo notas que pertenecen a la categoría seleccionada', (done) => {
      notesSubject.next([
        makeNote({ title: 'Con cat', categoryIds: ['filter-cat'] }),
        makeNote({ title: 'Sin cat', categoryIds: [] }),
      ]);

      facade.toggleTag('filter-cat');
      facade.notesVM$.pipe(first()).subscribe((notas) => {
        expect(notas.length).toBe(1);
        expect(notas[0].title).toBe('Con cat');
        done();
      });
    });

    it('debe quitar el tag si se llama toggleTag dos veces', (done) => {
      notesSubject.next([makeNote({ title: 'Con cat', categoryIds: ['toggle-cat'] })]);

      facade.toggleTag('toggle-cat');
      facade.toggleTag('toggle-cat'); // deseleccionar

      facade.notesVM$.pipe(first()).subscribe((notas) => {
        expect(notas.length).toBe(1); // sin filtro → retorna todo
        done();
      });
    });
  });

  // ─── categoriesVM$ ─────────────────────────────────────────────────────────

  describe('categoriesVM$', () => {
    it('debe excluir categorías con status=disabled', (done) => {
      categoriesSubject.next([
        makeCategory({ id: 'active-cat', status: 'active' }),
        makeCategory({ id: 'disabled-cat', status: 'disabled' }),
      ]);

      facade.categoriesVM$.pipe(first()).subscribe((cats) => {
        expect(cats.length).toBe(1);
        expect(cats[0].id).toBe('active-cat');
        done();
      });
    });

    it('debe contar notas activas y completadas por categoría', (done) => {
      const catId = 'count-cat';
      categoriesSubject.next([makeCategory({ id: catId })]);
      notesSubject.next([
        makeNote({ categoryIds: [catId], status: 'active' }),
        makeNote({ categoryIds: [catId], status: 'completed' }),
        makeNote({ categoryIds: [catId], status: 'deleted' }), // no cuenta
      ]);

      facade.categoriesVM$.pipe(first()).subscribe((cats) => {
        expect(cats[0].notesCount).toBe(2); // active + completed (deleted excluido)
        expect(cats[0].completedCount).toBe(1);
        done();
      });
    });

    it('canDelete debe ser true cuando notesCount === 0', (done) => {
      categoriesSubject.next([makeCategory({ id: 'empty-cat' })]);
      notesSubject.next([]);

      facade.categoriesVM$.pipe(first()).subscribe((cats) => {
        expect(cats[0].canDelete).toBeTrue();
        done();
      });
    });

    it('canDelete debe ser false cuando notesCount > 0', (done) => {
      const catId = 'non-empty-cat';
      categoriesSubject.next([makeCategory({ id: catId })]);
      notesSubject.next([makeNote({ categoryIds: [catId], status: 'active' })]);

      facade.categoriesVM$.pipe(first()).subscribe((cats) => {
        expect(cats[0].canDelete).toBeFalse();
        done();
      });
    });
  });

  // ─── selectedCategoriesVM$ ─────────────────────────────────────────────────

  describe('selectedCategoriesVM$', () => {
    it('debe enriquecer las categorías seleccionadas con conteos', (done) => {
      const catId = 'sel-cat';
      const cat = makeCategory({ id: catId });

      selectedCategoriesSubject.next([cat]);
      notesSubject.next([makeNote({ categoryIds: [catId], status: 'active' })]);

      facade.selectedCategoriesVM$.pipe(first()).subscribe((cats) => {
        expect(cats.length).toBe(1);
        expect(cats[0].notesCount).toBe(1);
        done();
      });
    });
  });

  // ─── Delegaciones a NotesService ──────────────────────────────────────────

  describe('delegaciones — NotesService', () => {
    it('addNote debe llamar a notesService.add', () => {
      facade.addNote({ title: 'T', content: 'C', status: 'active', isFavorite: false });
      expect(notesServiceMock.add).toHaveBeenCalled();
    });

    it('updateNote debe llamar a notesService.update', () => {
      facade.updateNote('id-123', { title: 'Nuevo título' });
      expect(notesServiceMock.update).toHaveBeenCalledWith('id-123', { title: 'Nuevo título' });
    });

    it('deleteNote debe llamar a notesService.delete', () => {
      facade.deleteNote('id-del');
      expect(notesServiceMock.delete).toHaveBeenCalledWith('id-del');
    });

    it('toggleFavorite debe llamar a notesService.toggleFavorite', () => {
      facade.toggleFavorite('id-fav');
      expect(notesServiceMock.toggleFavorite).toHaveBeenCalledWith('id-fav');
    });

    it('toggleComplete debe llamar a notesService.toggleComplete', () => {
      facade.toggleComplete('id-comp');
      expect(notesServiceMock.toggleComplete).toHaveBeenCalledWith('id-comp');
    });
  });

  // ─── Delegaciones a CategoriesService ────────────────────────────────────

  describe('delegaciones — CategoriesService', () => {
    it('addCategory debe llamar a categoriesService.add', () => {
      facade.addCategory('Nueva', '#color', '🏷');
      expect(categoriesServiceMock.add).toHaveBeenCalledWith('Nueva', '#color', '🏷');
    });

    it('disableCategory debe llamar a update con status disabled', () => {
      facade.disableCategory('cat-id');
      expect(categoriesServiceMock.update).toHaveBeenCalledWith('cat-id', { status: 'disabled' });
    });

    it('updateCategory debe propagar los cambios', () => {
      facade.updateCategory('cat-id', { name: 'Actualizada' });
      expect(categoriesServiceMock.update).toHaveBeenCalledWith('cat-id', { name: 'Actualizada' });
    });

    it('toggleCategory debe llamar a categoriesService.toggleCategory', () => {
      const cat = makeCategory();
      facade.toggleCategory(cat);
      expect(categoriesServiceMock.toggleCategory).toHaveBeenCalledWith(cat);
    });

    it('removeSelectedCategory debe llamar con el id de la categoría', () => {
      const cat = makeCategory({ id: 'rem-id' });
      facade.removeSelectedCategory(cat);
      expect(categoriesServiceMock.removeSelectedCategory).toHaveBeenCalledWith('rem-id');
    });

    it('clearSelectedCategories debe limpiar la selección', () => {
      facade.clearSelectedCategories();
      expect(categoriesServiceMock.clearSelectedCategories).toHaveBeenCalled();
    });

    it('selectedCategoryIds debe retornar los ids del service', () => {
      (categoriesServiceMock.selectedCategoryIds as jasmine.Spy).and.returnValue(['id-a', 'id-b']);
      expect(facade.selectedCategoryIds()).toEqual(['id-a', 'id-b']);
    });
  });

  // ─── filters$ ─────────────────────────────────────────────────────────────

  describe('filters$', () => {
    it('debe tener valores por defecto correctos', (done) => {
      facade.filters$.pipe(first()).subscribe((filters) => {
        expect(filters.search).toBe('');
        expect(filters.status).toBe('all');
        expect(filters.isFavorite).toBeFalse();
        expect(filters.categoryIds).toEqual([]);
        done();
      });
    });

    it('setSearch debe actualizar solo el campo search', (done) => {
      facade.setSearch('angular');
      facade.filters$.pipe(first()).subscribe((filters) => {
        expect(filters.search).toBe('angular');
        expect(filters.status).toBe('all'); // no se modifica
        done();
      });
    });

    it('setStatus debe actualizar solo el campo status', (done) => {
      facade.setStatus('completed');
      facade.filters$.pipe(first()).subscribe((filters) => {
        expect(filters.status).toBe('completed');
        expect(filters.search).toBe(''); // no se modifica
        done();
      });
    });

    it('toggleFavorites debe alternar el campo isFavorite', (done) => {
      facade.toggleFavorites();
      facade.filters$.pipe(first()).subscribe((filters) => {
        expect(filters.isFavorite).toBeTrue();
        done();
      });
    });

    it('toggleFavorites dos veces debe volver a false', (done) => {
      facade.toggleFavorites();
      facade.toggleFavorites();
      facade.filters$.pipe(first()).subscribe((filters) => {
        expect(filters.isFavorite).toBeFalse();
        done();
      });
    });

    it('toggleTag debe agregar un tag al array', (done) => {
      facade.toggleTag('tag-a');
      facade.filters$.pipe(first()).subscribe((filters) => {
        expect(filters.categoryIds).toContain('tag-a');
        done();
      });
    });

    it('toggleTag debe quitar el tag si ya existe', (done) => {
      facade.toggleTag('tag-b');
      facade.toggleTag('tag-b');
      facade.filters$.pipe(first()).subscribe((filters) => {
        expect(filters.categoryIds).not.toContain('tag-b');
        done();
      });
    });
  });
});
