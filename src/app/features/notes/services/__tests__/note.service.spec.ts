import { TestBed } from '@angular/core/testing';

import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';
import { StorageService } from 'src/app/core/services/storage.service';

import type { Note } from '../../models/note.model';
import { NotesService } from '../note.service';

// ─── Helper: fábrica de notas ─────────────────────────────────────────────────

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: crypto.randomUUID(),
    title: 'Nota de prueba',
    content: 'Contenido de la nota',
    status: 'active',
    isFavorite: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    categoryIds: [],
    ...overrides,
  };
}

describe('NotesService', () => {
  let service: NotesService;
  let storageSpy: jasmine.SpyObj<StorageService>;
  let fakeStore: Note[];

  beforeEach(() => {
    fakeStore = [];

    storageSpy = jasmine.createSpyObj<StorageService>('StorageService', [
      'get',
      'set',
      'remove',
      'clear',
    ]);
    storageSpy.get.and.callFake((key: string) => {
      if (key === STORAGE_KEYS.NOTES) {
        return fakeStore as unknown as null;
      }
      return null;
    });
    storageSpy.set.and.callFake((key: string, value: unknown) => {
      if (key === STORAGE_KEYS.NOTES) {
        fakeStore = value as Note[];
      }
    });

    TestBed.configureTestingModule({
      providers: [NotesService, { provide: StorageService, useValue: storageSpy }],
    });

    service = TestBed.inject(NotesService);
  });

  // ─── loadInitialNotes ───────────────────────────────────────────────────────

  describe('loadInitialNotes', () => {
    it('debe cargar notas del storage al inicializar', (done) => {
      const nota = makeNote({ title: 'Nota guardada' });
      fakeStore = [nota];

      service.loadInitialNotes(); // recarga desde fakeStore actualizado

      service.notes$.subscribe((notas) => {
        expect(notas).toContain(jasmine.objectContaining({ title: 'Nota guardada' }));
        done();
      });
    });

    it('debe iniciar con array vacío si el storage no tiene notas', (done) => {
      service.notes$.subscribe((notas) => {
        expect(notas).toEqual([]);
        done();
      });
    });
  });

  // ─── add ───────────────────────────────────────────────────────────────────

  describe('add', () => {
    it('debe agregar una nota con id, createdAt y updatedAt generados', (done) => {
      service.add({
        title: 'Nueva nota',
        content: 'Contenido',
        status: 'active',
        isFavorite: false,
      });

      service.notes$.subscribe((notas) => {
        expect(notas.length).toBe(1);
        expect(notas[0].id).toBeTruthy();
        expect(notas[0].createdAt).toBeGreaterThan(0);
        expect(notas[0].updatedAt).toBeGreaterThan(0);
        done();
      });
    });

    it('debe agregar la nota al INICIO del array (prepend)', (done) => {
      service.add({ title: 'Primera', content: '', status: 'active', isFavorite: false });
      service.add({ title: 'Segunda', content: '', status: 'active', isFavorite: false });

      service.notes$.subscribe((notas) => {
        expect(notas[0].title).toBe('Segunda');
        expect(notas[1].title).toBe('Primera');
        done();
      });
    });

    it('debe persistir la nota en el storage', () => {
      service.add({ title: 'Persistida', content: '', status: 'active', isFavorite: false });
      expect(storageSpy.set).toHaveBeenCalledWith(STORAGE_KEYS.NOTES, jasmine.any(Array));
    });
  });

  // ─── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('debe actualizar solo la nota con el id especificado', (done) => {
      service.add({ title: 'Original', content: '', status: 'active', isFavorite: false });

      let noteId: string;
      service.notes$.subscribe((notas) => {
        if (notas.length > 0 && !noteId) {
          noteId = notas[0].id;
          service.update(noteId, { title: 'Modificada' });
        } else if (notas.length > 0 && noteId) {
          expect(notas[0].title).toBe('Modificada');
          done();
        }
      });
    });

    it('debe actualizar el campo updatedAt', (done) => {
      const tiempoAntes = Date.now();
      service.add({ title: 'Test', content: '', status: 'active', isFavorite: false });

      service.notes$.subscribe((notas) => {
        if (notas.length > 0 && notas[0].title === 'Test') {
          const id = notas[0].id;
          service.update(id, { title: 'Nuevo título' });
        } else if (notas.length > 0 && notas[0].updatedAt >= tiempoAntes) {
          expect(notas[0].updatedAt).toBeGreaterThanOrEqual(tiempoAntes);
          done();
        }
      });
    });

    it('no debe modificar notas de otros ids', (done) => {
      service.add({ title: 'Nota A', content: '', status: 'active', isFavorite: false });
      service.add({ title: 'Nota B', content: '', status: 'active', isFavorite: false });

      let ids: string[] = [];
      let callCount = 0;

      service.notes$.subscribe((notas) => {
        callCount++;
        if (callCount === 1 && notas.length === 2) {
          ids = notas.map((n) => n.id);
          service.update(ids[0], { title: 'Modificada B' });
        } else if (callCount === 2) {
          const notaA = notas.find((n) => n.id === ids[1]);
          expect(notaA?.title).toBe('Nota A');
          done();
        }
      });
    });
  });

  // ─── delete ────────────────────────────────────────────────────────────────

  describe('delete', () => {
    it('debe marcar la nota como deleted (soft delete)', (done) => {
      service.add({ title: 'A borrar', content: '', status: 'active', isFavorite: false });

      let callCount = 0;
      service.notes$.subscribe((notas) => {
        callCount++;
        if (callCount === 1 && notas.length > 0) {
          service.delete(notas[0].id);
        } else if (callCount === 2) {
          expect(notas[0].status).toBe('deleted');
          done();
        }
      });
    });
  });

  // ─── toggleFavorite ────────────────────────────────────────────────────────

  describe('toggleFavorite', () => {
    it('debe alternar isFavorite de false a true', (done) => {
      service.add({ title: 'Fav test', content: '', status: 'active', isFavorite: false });

      let callCount = 0;
      service.notes$.subscribe((notas) => {
        callCount++;
        if (callCount === 1) {
          service.toggleFavorite(notas[0].id);
        } else if (callCount === 2) {
          expect(notas[0].isFavorite).toBeTrue();
          done();
        }
      });
    });

    it('debe alternar isFavorite de true a false', (done) => {
      service.add({ title: 'Fav test', content: '', status: 'active', isFavorite: true });

      let callCount = 0;
      service.notes$.subscribe((notas) => {
        callCount++;
        if (callCount === 1) {
          service.toggleFavorite(notas[0].id);
        } else if (callCount === 2) {
          expect(notas[0].isFavorite).toBeFalse();
          done();
        }
      });
    });

    it('no debe fallar si el id no existe', () => {
      expect(() => service.toggleFavorite('id-inexistente')).not.toThrow();
    });
  });

  // ─── toggleComplete ────────────────────────────────────────────────────────

  describe('toggleComplete', () => {
    it('debe cambiar status de active a completed', (done) => {
      service.add({ title: 'Test', content: '', status: 'active', isFavorite: false });

      let callCount = 0;
      service.notes$.subscribe((notas) => {
        callCount++;
        if (callCount === 1) {
          service.toggleComplete(notas[0].id);
        } else if (callCount === 2) {
          expect(notas[0].status).toBe('completed');
          done();
        }
      });
    });

    it('debe cambiar status de completed a active', (done) => {
      service.add({ title: 'Test', content: '', status: 'completed', isFavorite: false });

      let callCount = 0;
      service.notes$.subscribe((notas) => {
        callCount++;
        if (callCount === 1) {
          service.toggleComplete(notas[0].id);
        } else if (callCount === 2) {
          expect(notas[0].status).toBe('active');
          done();
        }
      });
    });

    it('no debe fallar si el id no existe', () => {
      expect(() => service.toggleComplete('id-inexistente')).not.toThrow();
    });
  });

  // ─── stats$ ────────────────────────────────────────────────────────────────

  describe('stats$', () => {
    it('debe calcular correctamente las estadísticas', (done) => {
      service.add({ title: 'A1', content: '', status: 'active', isFavorite: false });
      service.add({ title: 'A2', content: '', status: 'active', isFavorite: true });
      service.add({ title: 'C1', content: '', status: 'completed', isFavorite: false });
      service.add({ title: 'D1', content: '', status: 'deleted', isFavorite: false });

      service.stats$.subscribe((stats) => {
        if (stats.total === 4) {
          expect(stats.total).toBe(4);
          expect(stats.active).toBe(2);
          expect(stats.completed).toBe(1);
          expect(stats.deleted).toBe(1);
          expect(stats.favorites).toBe(1);
          done();
        }
      });
    });

    it('debe retornar ceros cuando no hay notas', (done) => {
      service.stats$.subscribe((stats) => {
        expect(stats.total).toBe(0);
        expect(stats.active).toBe(0);
        expect(stats.favorites).toBe(0);
        done();
      });
    });
  });
});
