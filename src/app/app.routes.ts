import { type Routes } from '@angular/router';

import { ROUTES } from './core/constants/routes.constant';
import { EmptyLayoutComponent } from './shared/ui/layout/empty/empty.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: ROUTES.SPLASH,
    pathMatch: 'full',
  },
  {
    path: '',
    component: EmptyLayoutComponent,
    children: [
      {
        path: ROUTES.SPLASH,
        loadComponent: () => import('./features/spash/pages/splash.page').then((m) => m.SplashPage),
      },
      {
        path: ROUTES.ONBOARDING,
        loadComponent: () =>
          import('./features/onboarding/pages/onboarding.page').then((m) => m.OnboardingPage),
      },
    ],
  },
  {
    path: ROUTES.AUTH.ROOT,
    component: EmptyLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: ROUTES.AUTH.LOGIN,
        pathMatch: 'full',
      },
      {
        path: ROUTES.AUTH.LOGIN,
        loadComponent: () =>
          import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: ROUTES.AUTH.REGISTER,
        loadComponent: () =>
          import('./features/auth/pages/register/register.page').then((m) => m.RegisterPage),
      },
    ],
  },
  {
    path: 'notes',
    loadComponent: () => import('./features/notes/pages/note.page').then((m) => m.NotePage),
  },
];
