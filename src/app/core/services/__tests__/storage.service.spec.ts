import { TestBed } from '@angular/core/testing';

import { StorageService } from '../storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] ?? null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete store[key];
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      store = {};
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  describe('get', () => {
    it('debe retornar null cuando la clave no existe', () => {
      expect(service.get('inexistente')).toBeNull();
    });

    it('debe parsear y retornar el JSON almacenado', () => {
      store['clave'] = JSON.stringify({ nombre: 'test' });
      expect(service.get('clave')).toEqual({ nombre: 'test' });
    });

    it('debe soportar tipos primitivos', () => {
      store['num'] = JSON.stringify(42);
      expect(service.get<number>('num')).toBe(42);
    });

    it('debe soportar arrays', () => {
      store['arr'] = JSON.stringify([1, 2, 3]);
      expect(service.get<number[]>('arr')).toEqual([1, 2, 3]);
    });

    it('debe retornar null cuando el JSON es inválido', () => {
      store['roto'] = 'not{{{valid-json';
      expect(service.get('roto')).toBeNull();
    });
  });

  describe('set', () => {
    it('debe serializar a JSON y guardar el valor', () => {
      service.set('clave', { hello: 'mundo' });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'clave',
        JSON.stringify({ hello: 'mundo' }),
      );
    });

    it('debe sobrescribir un valor existente', () => {
      service.set('clave', 'primero');
      service.set('clave', 'segundo');
      expect(store['clave']).toBe(JSON.stringify('segundo'));
    });
  });

  describe('remove', () => {
    it('debe eliminar la clave del localStorage', () => {
      store['clave'] = 'valor';
      service.remove('clave');
      expect(localStorage.removeItem).toHaveBeenCalledWith('clave');
    });

    it('no debe fallar si la clave no existe', () => {
      expect(() => service.remove('inexistente')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('debe limpiar todo el localStorage', () => {
      store['a'] = 'x';
      store['b'] = 'y';
      service.clear();
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });
});
