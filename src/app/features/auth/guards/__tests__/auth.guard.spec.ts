import { TestBed } from '@angular/core/testing';
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { provideRouter, Router, UrlTree } from '@angular/router';

import { ROUTES } from 'src/app/core/constants/routes.constant';

import { AuthFacade } from '../../facade/auth.facade';
import { guestGuard } from '../auth.guard';

/**
 * auth.guard.ts exporta `guestGuard`:
 * - Si el usuario NO está autenticado → retorna true (accede a rutas de auth)
 * - Si el usuario ESTÁ autenticado   → redirige a /app/dashboard
 */
describe('guestGuard', () => {
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

  it('debe retornar true cuando el usuario NO está autenticado', () => {
    authFacadeSpy.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => guestGuard(fakeRoute, fakeState));

    expect(result).toBeTrue();
  });

  it('debe redirigir a /app/dashboard cuando el usuario YA está autenticado', () => {
    authFacadeSpy.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => guestGuard(fakeRoute, fakeState));

    expect(result instanceof UrlTree).toBeTrue();
    const urlTree = result as UrlTree;
    expect(router.serializeUrl(urlTree)).toBe('/app/' + ROUTES.APP.ROOT);
  });
});
