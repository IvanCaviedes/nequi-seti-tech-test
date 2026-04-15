import { TestBed } from '@angular/core/testing';

import { LoggerService } from '../logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  describe('error', () => {
    it('debe llamar a console.error con el mensaje', () => {
      spyOn(console, 'error');
      service.error('algo falló');
      expect(console.error).toHaveBeenCalledWith('algo falló', undefined);
    });

    it('debe pasar el objeto error como segundo argumento', () => {
      spyOn(console, 'error');
      const err = new Error('boom');
      service.error('error al guardar', err);
      expect(console.error).toHaveBeenCalledWith('error al guardar', err);
    });
  });

  describe('warn', () => {
    it('debe llamar a console.warn con el mensaje', () => {
      spyOn(console, 'warn');
      service.warn('advertencia');
      expect(console.warn).toHaveBeenCalledWith('advertencia');
    });
  });

  describe('log', () => {
    it('debe ser un método callable sin lanzar errores', () => {
      // console.log puede o no ejecutarse dependiendo del entorno (production flag)
      spyOn(console, 'log');
      expect(() => service.log('mensaje debug')).not.toThrow();
    });
  });
});
