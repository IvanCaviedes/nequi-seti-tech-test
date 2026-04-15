import { TestBed } from '@angular/core/testing';
import { firstValueFrom, skip, take } from 'rxjs';

import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';
import { StorageService } from 'src/app/core/services/storage.service';

import type { Category } from '../../models/category.model';
import { CategoriesService } from '../categories.service';

// ─── Helper ────────────────────────────────────────────────────────────────────

function makeCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: crypto.randomUUID(),
    name: 'Categoría test',
    color: '#ff0000',
    icon: 'star',
    status: 'active',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

describe('CategoriesService', () => {
  let service: CategoriesService;
  let storageSpy: jasmine.SpyObj<StorageService>;
  let fakeStore: Category[];

  beforeEach(() => {
    fakeStore = [];

    storageSpy = jasmine.createSpyObj<StorageService>('StorageService', [
      'get',
      'set',
      'remove',
      'clear',
    ]);
    storageSpy.get.and.callFake((key: string) => {
      if (key === STORAGE_KEYS.CATEGORIES) {
        return fakeStore as unknown as null;
      }
      return null;
    });
    storageSpy.set.and.callFake((key: string, value: unknown) => {
      if (key === STORAGE_KEYS.CATEGORIES) {
        fakeStore = value as Category[];
      }
    });

    TestBed.configureTestingModule({
      providers: [CategoriesService, { provide: StorageService, useValue: storageSpy }],
    });

    service = TestBed.inject(CategoriesService);
  });

  // ─── loadInitialCategories ─────────────────────────────────────────────────

  describe('loadInitialCategories', () => {
    it('debe cargar categorías del storage al inicializar', (done) => {
      fakeStore = [makeCategory({ name: 'Trabajo' })];
      service.loadInitialCategories();

      service.categories$.subscribe((cats) => {
        expect(cats).toContain(jasmine.objectContaining({ name: 'Trabajo' }));
        done();
      });
    });

    it('debe iniciar vacío si el storage no tiene categorías', (done) => {
      service.categories$.subscribe((cats) => {
        expect(cats).toEqual([]);
        done();
      });
    });
  });

  // ─── add ───────────────────────────────────────────────────────────────────

  describe('add', () => {
    it('debe agregar una categoría con id único y timestamps', (done) => {
      service.add('Personal', '#blue', '📝');

      service.categories$.subscribe((cats) => {
        if (cats.length > 0) {
          const cat = cats[0];
          expect(cat.id).toBeTruthy();
          expect(cat.name).toBe('Personal');
          expect(cat.color).toBe('#blue');
          expect(cat.icon).toBe('📝');
          expect(cat.status).toBe('active');
          expect(cat.createdAt).toBeGreaterThan(0);
          done();
        }
      });
    });

    it('debe agregar al INICIO del array (prepend)', (done) => {
      service.add('Primera', '#aaa', '⭐');
      service.add('Segunda', '#bbb', '📌');

      service.categories$.subscribe((cats) => {
        if (cats.length === 2) {
          expect(cats[0].name).toBe('Segunda');
          expect(cats[1].name).toBe('Primera');
          done();
        }
      });
    });

    it('debe persistir en el storage', () => {
      service.add('Test', '#000', '🔖');
      expect(storageSpy.set).toHaveBeenCalledWith(STORAGE_KEYS.CATEGORIES, jasmine.any(Array));
    });
  });

  // ─── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('debe actualizar solo la categoría con el id especificado', (done) => {
      service.add('Original', '#red', '🔴');

      let callCount = 0;
      service.categories$.subscribe((cats) => {
        callCount++;
        if (callCount === 1 && cats.length > 0) {
          service.update(cats[0].id, { name: 'Modificada' });
        } else if (callCount === 2) {
          expect(cats[0].name).toBe('Modificada');
          done();
        }
      });
    });

    it('no debe modificar otras categorías', (done) => {
      service.add('Cat A', '#a', 'a');
      service.add('Cat B', '#b', 'b');

      let ids: string[];
      let callCount = 0;

      service.categories$.subscribe((cats) => {
        callCount++;
        if (callCount === 1 && cats.length === 2) {
          ids = cats.map((c) => c.id);
          service.update(ids[0], { name: 'Cat B modificada' });
        } else if (callCount === 2) {
          const catA = cats.find((c) => c.id === ids[1]);
          expect(catA?.name).toBe('Cat A');
          done();
        }
      });
    });
  });

  // ─── delete ────────────────────────────────────────────────────────────────

  describe('delete', () => {
    it('debe eliminar la categoría del array (hard delete)', (done) => {
      service.add('A eliminar', '#x', 'x');

      let callCount = 0;
      service.categories$.subscribe((cats) => {
        callCount++;
        if (callCount === 1 && cats.length > 0) {
          service.delete(cats[0].id);
        } else if (callCount === 2) {
          expect(cats.length).toBe(0);
          done();
        }
      });
    });

    it('no debe fallar si el id no existe', () => {
      expect(() => service.delete('id-inexistente')).not.toThrow();
    });
  });

  // ─── toggleCategory (selección) ────────────────────────────────────────────

  describe('toggleCategory', () => {
    it('debe agregar una categoría a la selección si no está', async () => {
      const cat = makeCategory({ id: 'cat-1' });

      const resultPromise = firstValueFrom(service.selectedCategories$.pipe(skip(1), take(1)));

      service.toggleCategory(cat);

      const selected = await resultPromise;

      expect(selected[0].id).toBe('cat-1');
    });

    it('debe quitar una categoría de la selección si ya está', async () => {
      const cat = makeCategory({ id: 'cat-2' });

      const resultPromise = firstValueFrom(service.selectedCategories$.pipe(skip(2), take(1)));

      service.toggleCategory(cat); // add
      service.toggleCategory(cat); // remove

      const selected = await resultPromise;

      expect(selected.length).toBe(0);
    });

    it('debe poder tener múltiples categorías seleccionadas', async () => {
      const cat1 = makeCategory({ id: 'cat-multi-1' });
      const cat2 = makeCategory({ id: 'cat-multi-2' });

      const resultPromise = firstValueFrom(service.selectedCategories$.pipe(skip(2), take(1)));

      service.toggleCategory(cat1);
      service.toggleCategory(cat2);

      const selected = await resultPromise;

      expect(selected.map((c) => c.id)).toContain('cat-multi-1');
      expect(selected.map((c) => c.id)).toContain('cat-multi-2');
    });
  });

  // ─── removeSelectedCategory ────────────────────────────────────────────────

  describe('removeSelectedCategory', () => {
    it('debe eliminar solo la categoría indicada de la selección', (done) => {
      const cat1 = makeCategory({ id: 'rem-1' });
      const cat2 = makeCategory({ id: 'rem-2' });

      service.toggleCategory(cat1);
      service.toggleCategory(cat2);
      service.removeSelectedCategory('rem-1');

      service.selectedCategories$.subscribe((selected) => {
        if (selected.length === 1) {
          expect(selected[0].id).toBe('rem-2');
          done();
        }
      });
    });
  });

  // ─── clearSelectedCategories ───────────────────────────────────────────────

  describe('clearSelectedCategories', () => {
    it('debe vaciar todas las categorías seleccionadas', async () => {
      service.toggleCategory(makeCategory({ id: 'c1' }));
      service.toggleCategory(makeCategory({ id: 'c2' }));

      const resultPromise = firstValueFrom(service.selectedCategories$.pipe(skip(1), take(1)));

      service.clearSelectedCategories();

      const selected = await resultPromise;
      expect(selected.length).toBe(0);
    });
  });

  // ─── selectedCategoryIds ───────────────────────────────────────────────────

  describe('selectedCategoryIds', () => {
    it('debe retornar array de ids de las categorías seleccionadas', () => {
      service.toggleCategory(makeCategory({ id: 'id-x' }));
      service.toggleCategory(makeCategory({ id: 'id-y' }));

      const ids = service.selectedCategoryIds();
      expect(ids).toContain('id-x');
      expect(ids).toContain('id-y');
    });

    it('debe retornar array vacío sin selección', () => {
      expect(service.selectedCategoryIds()).toEqual([]);
    });
  });
});
