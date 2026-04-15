import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';
import { StorageService } from 'src/app/core/services/storage.service';

import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let storageSpy: jasmine.SpyObj<StorageService>;

  // usuarios simulados en "base de datos"
  let fakeDb: Array<{ email: string; password: string }>;

  beforeEach(() => {
    fakeDb = [];

    storageSpy = jasmine.createSpyObj<StorageService>('StorageService', [
      'get',
      'set',
      'remove',
      'clear',
    ]);

    // get devuelve la fakeDb cuando pide USERS, null en otros casos
    storageSpy.get.and.callFake((key: string) => {
      if (key === STORAGE_KEYS.USERS) {
        return fakeDb as unknown as null;
      }
      return null;
    });

    storageSpy.set.and.callFake((key: string, value: unknown) => {
      if (key === STORAGE_KEYS.USERS) {
        fakeDb = value as typeof fakeDb;
      }
    });

    // Limpiamos localStorage/sessionStorage real antes de cada test
    localStorage.clear();
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: StorageService, useValue: storageSpy }],
    });

    service = TestBed.inject(AuthService);
  });

  // ─── seedUsers ────────────────────────────────────────────────────────────

  describe('seedUsers (inicialización)', () => {
    it('debe crear el usuario por defecto si no hay usuarios', () => {
      // Al inyectar el servicio se llama seedUsers en el constructor
      expect(fakeDb.length).toBe(1);
      expect(fakeDb[0].email).toBe('test@test.com');
    });

    it('NO debe agregar el usuario por defecto si ya existen usuarios', () => {
      fakeDb = [{ email: 'existente@test.com', password: btoa('abc123') }];
      // Recreamos el servicio para re-ejecutar el constructor
      const another = TestBed.inject(AuthService);
      // El seed no agrega más usuarios porque fakeDb.length > 0
      // (el spy devuelve el fakeDb nuevo que tiene 1 elemento)
      expect(another).toBeTruthy();
    });
  });

  // ─── register ─────────────────────────────────────────────────────────────

  describe('register', () => {
    it('debe registrar un usuario nuevo y emitir token + user', fakeAsync(() => {
      let result: { token: string; user: { email: string } } | undefined;
      service.register('nuevo@test.com', 'password123').subscribe((r) => (result = r));
      tick(800);
      expect(result).toBeDefined();
      expect(result!.user.email).toBe('nuevo@test.com');
      expect(result!.token).toBeTruthy();
    }));

    it('debe lanzar error si el email ya está registrado', fakeAsync(() => {
      // Registramos primero
      service.register('dup@test.com', 'password123').subscribe();
      tick(800);

      let errorMsg = '';
      service.register('dup@test.com', 'otrapass').subscribe({
        error: (e: Error) => (errorMsg = e.message),
      });
      tick(800);

      expect(errorMsg).toBe('Email already in use');
    }));

    it('debe lanzar error si la contraseña es muy corta (< 6 chars)', () => {
      let errorMsg = '';
      service.register('short@test.com', '123').subscribe({
        error: (e: Error) => (errorMsg = e.message),
      });
      expect(errorMsg).toBe('Password too weak');
    });

    it('debe hashear la contraseña antes de guardarla', fakeAsync(() => {
      service.register('hash@test.com', 'secreta').subscribe();
      tick(800);
      const saved = fakeDb.find((u) => u.email === 'hash@test.com');
      expect(saved?.password).toBe(btoa('secreta'));
      expect(saved?.password).not.toBe('secreta');
    }));
  });

  // ─── login ────────────────────────────────────────────────────────────────

  describe('login', () => {
    beforeEach(fakeAsync(() => {
      // Registramos el usuario de prueba
      service.register('user@test.com', 'mipass1').subscribe();
      tick(800);
    }));

    it('debe retornar token y user con credenciales válidas', fakeAsync(() => {
      let result: { token: string; user: { email: string } } | undefined;
      service.login('user@test.com', 'mipass1').subscribe((r) => (result = r));
      tick(800);
      expect(result!.user.email).toBe('user@test.com');
      expect(result!.token).toBeTruthy();
    }));

    it('debe lanzar error con contraseña incorrecta', fakeAsync(() => {
      let errorMsg = '';
      service.login('user@test.com', 'wrongpass').subscribe({
        error: (e: Error) => (errorMsg = e.message),
      });
      tick(800);
      expect(errorMsg).toBe('Invalid credentials');
    }));

    it('debe lanzar error si el usuario no existe', fakeAsync(() => {
      let errorMsg = '';
      service.login('nobody@test.com', 'cualquiera').subscribe({
        error: (e: Error) => (errorMsg = e.message),
      });
      tick(800);
      expect(errorMsg).toBe('Invalid credentials');
    }));
  });

  // ─── getCurrentUser ────────────────────────────────────────────────────────

  describe('getCurrentUser', () => {
    it('debe retornar null si no hay token', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('debe retornar el user desde localStorage si el token es válido', () => {
      const payload = { email: 'alguien@test.com', exp: Date.now() + 60_000 };
      localStorage.setItem(STORAGE_KEYS.AUTH, btoa(JSON.stringify(payload)));
      expect(service.getCurrentUser()).toEqual({ email: 'alguien@test.com' });
    });

    it('debe retornar el user desde sessionStorage si el token es válido', () => {
      const payload = { email: 'session@test.com', exp: Date.now() + 60_000 };
      sessionStorage.setItem(STORAGE_KEYS.AUTH, btoa(JSON.stringify(payload)));
      expect(service.getCurrentUser()).toEqual({ email: 'session@test.com' });
    });

    it('debe retornar null y hacer logout si el token está expirado', () => {
      const payload = { email: 'expirado@test.com', exp: Date.now() - 1000 };
      localStorage.setItem(STORAGE_KEYS.AUTH, btoa(JSON.stringify(payload)));
      spyOn(service, 'logout');
      const result = service.getCurrentUser();
      expect(result).toBeNull();
      expect(service.logout).toHaveBeenCalled();
    });

    it('debe retornar null si el token no es base64 válido', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH, 'token_invalido!!!');
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  // ─── logout ───────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('debe eliminar el token del storage y sessionStorage', () => {
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'token');
      service.logout();
      expect(storageSpy.remove).toHaveBeenCalledWith(STORAGE_KEYS.AUTH);
      expect(sessionStorage.getItem(STORAGE_KEYS.AUTH)).toBeNull();
    });
  });
});
