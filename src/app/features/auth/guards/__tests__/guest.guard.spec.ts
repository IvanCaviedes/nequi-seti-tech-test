import { TestBed } from '@angular/core/testing';
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { provideRouter, Router, UrlTree } from '@angular/router';

import { AuthFacade } from '../../facade/auth.facade';
import { authGuard } from '../guest.guard';

/**
 * guest.guard.ts exporta `authGuard`:
 * - Si el usuario ESTÁ autenticado   → retorna true (accede a rutas protegidas)
 * - Si el usuario NO está autenticado → redirige a /auth/login
 */
describe('authGuard', () => {
  let authFacadeSpy: jasmine.SpyObj<AuthFacade>;
  let router: Router;

  const fakeRoute = {} as ActivatedRouteSnapshot;
  const fakeState = {} as RouterStateSnapshot;

  beforeEach(() => {
    authFacadeSpy = jasmine.createSpyObj<AuthFacade>('AuthFacade', ['isAuthenticated']);

    TestBed.configureTestingModule({
      providers: [{ provide: AuthFacade, useValue: authFacadeSpy }, provideRouter([])],
    });

    router = TestBed.inject(Router);
  });

  it('debe retornar true cuando el usuario ESTÁ autenticado', () => {
    authFacadeSpy.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard(fakeRoute, fakeState));

    expect(result).toBeTrue();
  });

  it('debe redirigir a /auth/login cuando el usuario NO está autenticado', () => {
    authFacadeSpy.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => authGuard(fakeRoute, fakeState));

    expect(result instanceof UrlTree).toBeTrue();
    const urlTree = result as UrlTree;
    expect(router.serializeUrl(urlTree)).toBe('/auth/login');
  });
});
