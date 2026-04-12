import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { ROUTES } from 'src/app/core/constants/routes.constant';

import { AuthFacade } from '../facade/auth.facade';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/app/' + ROUTES.APP.ROOT]);
};
