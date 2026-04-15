import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';

import { AuthService } from '../../services/auth.service';
import { AuthFacade } from '../auth.facade';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockToken = btoa(JSON.stringify({ email: 'test@test.com', exp: Date.now() + 60_000 }));

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'login',
      'register',
      'logout',
      'getCurrentUser',
    ]);

    // Por defecto no hay sesión activa
    authServiceSpy.getCurrentUser.and.returnValue(null);

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([]),
      ],
    });

    facade = TestBed.inject(AuthFacade);
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
  });

  // ─── Estado inicial ────────────────────────────────────────────────────────

  describe('estado inicial', () => {
    it('debe iniciar con loading=false, error=null, user=null si no hay sesión', (done) => {
      facade.state$.subscribe((s) => {
        expect(s.loading).toBeFalse();
        expect(s.error).toBeNull();
        expect(s.user).toBeNull();
        done();
      });
    });

    it('debe restaurar el usuario si ya había sesión activa', () => {
      authServiceSpy.getCurrentUser.and.returnValue({ email: 'guardado@test.com' });
      // Recreamos el facade para re-ejecutar el constructor con la nueva sesión
      const nuevoFacade = TestBed.runInInjectionContext(() => new AuthFacade());
      expect(nuevoFacade.isAuthenticated()).toBeTrue();
    });
  });

  // ─── isAuthenticated ───────────────────────────────────────────────────────

  describe('isAuthenticated', () => {
    it('debe retornar false cuando no hay usuario en el state', () => {
      expect(facade.isAuthenticated()).toBeFalse();
    });
  });

  // ─── login ────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('debe actualizar el state con el user y navegar al dashboard en login exitoso', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(
        of({ token: mockToken, user: { email: 'test@test.com' } }),
      );

      facade.login('test@test.com', 'pass123', false);
      tick();

      expect(facade.isAuthenticated()).toBeTrue();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/app/dashboard');
    }));

    it('debe guardar el token en sessionStorage cuando remember=false', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(
        of({ token: mockToken, user: { email: 'test@test.com' } }),
      );

      facade.login('test@test.com', 'pass123', false);
      tick();

      expect(sessionStorage.getItem(STORAGE_KEYS.AUTH)).toBe(mockToken);
      expect(localStorage.getItem(STORAGE_KEYS.AUTH)).toBeNull();
    }));

    it('debe guardar el token en localStorage cuando remember=true', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(
        of({ token: mockToken, user: { email: 'test@test.com' } }),
      );

      facade.login('test@test.com', 'pass123', true);
      tick();

      expect(localStorage.getItem(STORAGE_KEYS.AUTH)).toBe(mockToken);
    }));

    it('debe setear el mensaje de error cuando el login falla', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

      facade.login('bad@test.com', 'wrong', false);
      tick();

      let state: { error: string | null; loading: boolean } | undefined;
      facade.state$.subscribe((s) => (state = s));

      expect(state!.error).toBe('Invalid credentials');
      expect(state!.loading).toBeFalse();
    }));

    it('debe resetear loading a false después del login (éxito)', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(
        of({ token: mockToken, user: { email: 'test@test.com' } }),
      );
      facade.login('test@test.com', 'pass', false);
      tick();

      let loading: boolean | undefined;
      facade.state$.subscribe((s) => (loading = s.loading));
      expect(loading).toBeFalse();
    }));

    it('debe resetear loading a false después del login (error)', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(throwError(() => new Error('fail')));
      facade.login('x@test.com', 'pass', false);
      tick();

      let loading: boolean | undefined;
      facade.state$.subscribe((s) => (loading = s.loading));
      expect(loading).toBeFalse();
    }));
  });

  // ─── register ─────────────────────────────────────────────────────────────

  describe('register', () => {
    it('debe hacer auto-login y navegar al dashboard en registro exitoso', fakeAsync(() => {
      authServiceSpy.register.and.returnValue(
        of({ token: mockToken, user: { email: 'nuevo@test.com' } }),
      );

      facade.register('nuevo@test.com', 'pass123');
      tick();

      expect(facade.isAuthenticated()).toBeTrue();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/app/dashboard');
    }));

    it('debe guardar el token en localStorage durante el auto-login del registro', fakeAsync(() => {
      authServiceSpy.register.and.returnValue(
        of({ token: mockToken, user: { email: 'nuevo@test.com' } }),
      );

      facade.register('nuevo@test.com', 'pass123');
      tick();

      expect(localStorage.getItem(STORAGE_KEYS.AUTH)).toBe(mockToken);
    }));

    it('debe setear error cuando el registro falla', fakeAsync(() => {
      authServiceSpy.register.and.returnValue(throwError(() => new Error('Email already in use')));

      facade.register('dup@test.com', 'pass123');
      tick();

      let state: { error: string | null } | undefined;
      facade.state$.subscribe((s) => (state = s));
      expect(state!.error).toBe('Email already in use');
    }));
  });

  // ─── logout ───────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('debe limpiar el state y navegar a /auth/login', fakeAsync(() => {
      // Primero simulamos un usuario logueado
      authServiceSpy.login.and.returnValue(
        of({ token: mockToken, user: { email: 'test@test.com' } }),
      );
      facade.login('test@test.com', 'pass', false);
      tick();

      facade.logout();

      let state: { user: unknown; error: unknown; loading: boolean } | undefined;
      facade.state$.subscribe((s) => (state = s));

      expect(state!.user).toBeNull();
      expect(state!.error).toBeNull();
      expect(state!.loading).toBeFalse();
      expect(authServiceSpy.logout).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/login');
    }));
  });
});
