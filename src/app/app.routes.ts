import type { Routes } from '@angular/router';

import { AuthShellPage } from './features/auth/pages/auth-shell/auth-shell.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/register',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () => import('./features/spash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./features/onboarding/onboarding.page').then((m) => m.OnboardingPage),
  },
  {
    path: 'auth',
    component: AuthShellPage,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
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
